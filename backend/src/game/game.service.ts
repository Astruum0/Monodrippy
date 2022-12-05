import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from 'src/board/board.schema';
import { movePlayer, nextPlayer } from 'src/engine/playerMovement';
import { buyTile, payRent, upgradeTile } from 'src/engine/tileHandler';
import { goToJail, turnInJail } from 'src/engine/jailService';
import { Action, historyByBoard, nextActionByBoard } from 'src/models/action';
import { gameOutput } from 'src/models/gameOutput';
import { IDicePlay, ITileAction } from 'src/models/IUserAction';
import { player, playerDocument } from 'src/player/player.schema';
import { tiles } from 'src/tiles/tiles.schema';

@Injectable()
export class gameService {
	historyByBoard: historyByBoard = {};
	nextActionByBoard: nextActionByBoard = {};

	constructor(
		@InjectModel(board.name) private boardModel: Model<boardDocument>,
		@InjectModel(player.name) private playerModel: Model<playerDocument>,
	) {
		// this.startGame(1, "bb0e11fe-a48d-4f29-8f57-7eae83cb0433"); // debug purposes
	}

	async startGame(gameId: Number, userId: string) {
		let board = await this.boardModel.findOne({ id: gameId }).exec();

		if (board.players.length < 2) {
			throw new Error('Not enough players in the game');
		}
		if (board.players[0].id !== userId) {
			throw new Error("You don't have the permission to start the game");
		}

		board.hasStarted = true;
		board.currentTurn =
			board.players[Math.floor(Math.random() * board.players.length)].id;

		this.nextActionByBoard[board.id] = new Action('TURN', board.currentTurn);
		this.historyByBoard[board.id] = [new Action('Game has started')];

		board.save();

		return {
			message: 'Game has started',
		};
	}

	async resetGame(gameId: Number) {
		let board = await this.boardModel.findOne({ id: gameId }).exec();
		let player_id = [];
		for (let index = board.players.length; index > 0; index--) {
			player_id.push(board.players.pop()['id']);
		}
		for (const tile of board.tiles) {
			if (tile.owner) tile.owner = null;
			if (tile.currentLevel >= 0) tile.currentLevel = undefined;
		}

		this.historyByBoard[gameId as number] = [];
		this.nextActionByBoard[gameId as number] = undefined;
		board.hasStarted = false;
		board.currentTurn = undefined;

		board.markModified('tiles');
		board.save();
		return player_id;
	}

	async gameOutput(id: Number): Promise<gameOutput> {
		return {
			nextAction: this.nextActionByBoard[id as number] || undefined,
			history: this.historyByBoard[id as number] || [],
			board: await this.boardModel.findOne({ id: id }).exec(),
		};
	}

	async play(payload: IDicePlay | ITileAction): Promise<gameOutput> {
		const nextAction = this.nextActionByBoard[payload.boardId];
		let board = await this.boardModel.findOne({ id: payload.boardId }).exec();
		let currentPlayer = board.players.find((p) => p.id === payload.userId);
		let currentPosition = currentPlayer.position;
		let currentTile = board.tiles[currentPosition];
		const { userId, type } = payload;

		if (nextAction.userConcerned !== userId) {
			throw new Error('Incorrect user turn');
		}

		if (nextAction.description !== type) {
			throw new Error(
				`Incorrect action type, expected ${nextAction.description}`,
			);
		}

		if (currentPlayer.turnsInPrison > 1) {
			const { dices } = payload as IDicePlay;

			const [newAction, actionsDone] = turnInJail(board, currentPlayer, dices);
			this.nextActionByBoard[payload.boardId] = newAction;
			this.historyByBoard[payload.boardId] =
				this.historyByBoard[payload.boardId].concat(actionsDone);

			board.currentTurn = this.nextActionByBoard[payload.boardId].userConcerned;
			board.markModified('players');
			board.markModified('tiles');
			board.save();
			return this.gameOutput(payload.boardId);
		}

		if (nextAction.description === 'TURN' && type === 'TURN') {
			const { dices } = payload;
			const [newAction, actionsDone] = movePlayer(
				userId,
				// dices.reduce((a, b) => a + b, 0),
				6,
				board,
			);

			this.nextActionByBoard[payload.boardId] = newAction;
			this.historyByBoard[payload.boardId] =
				this.historyByBoard[payload.boardId].concat(actionsDone);
		}

		if (nextAction.description === 'BUY' && type === 'BUY') {
			const { amount } = payload;

			const [newAction, actionsDone] = await Promise.resolve(
				this.tileAction(board, currentTile, currentPlayer, type, amount),
			);

			this.nextActionByBoard[payload.boardId] = newAction;
			this.historyByBoard[payload.boardId] =
				this.historyByBoard[payload.boardId].concat(actionsDone);
		}

		board.currentTurn = this.nextActionByBoard[payload.boardId].userConcerned;
		board.markModified('players');
		board.markModified('tiles');
		board.save();
		return this.gameOutput(payload.boardId);
	}

	async tileAction(
		board: board,
		tile: tiles,
		player: player,
		action: 'BUY' | 'UPGRADE' | 'PAY',
		amount: number = undefined,
	): Promise<[Action, Action[]]> {
		if (action === 'BUY' && amount >= 0) {
			return buyTile(board, player, tile, amount);
		} else if (action === 'UPGRADE') {
			return upgradeTile(board, player, tile);
		} else if (action === 'PAY') {
			return payRent(board, player, tile);
		} else if (action === 'BUY') {
			const nextAction = new Action(
				'TURN',
				nextPlayer(
					board.players.find((p) => p.id === player.id),
					board.players,
				).id,
			);
			const history = [new Action('NOT BOUGHT', player.id, tile.id)];
			return [nextAction, history];
		}
	}
}
