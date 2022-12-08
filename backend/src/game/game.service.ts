import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from 'src/board/board.schema';
import { movePlayer, nextPlayer } from 'src/engine/playerMovement';
import { buyTile, payRent, upgradeTile } from 'src/engine/tileHandler';
import { turnInJail } from 'src/engine/jailService';
import { Action, historyByBoard, nextActionByBoard } from 'src/models/action';
import { gameOutput } from 'src/models/gameOutput';
import { IDicePlay, ITileAction } from 'src/models/IUserAction';
import { player } from 'src/player/player.schema';
import { tiles } from 'src/tiles/tiles.schema';
import { getWinner } from 'src/engine/endGame';

@Injectable()
export class gameService {
	historyByBoard: historyByBoard = {};
	nextActionByBoard: nextActionByBoard = {};
	lastActionId: String = '';

	constructor(
		@InjectModel(board.name) private boardModel: Model<boardDocument>,
	) {
		// this.startGame(1, "bb0e11fe-a48d-4f29-8f57-7eae83cb0433"); // debug purposes
	}

	kickPlayer(player: player, board: board) {
		this.lastActionId = this.nextActionByBoard[board.id].id;

		let timeout = setTimeout(async () => {
			if (this.lastActionId === this.nextActionByBoard[board.id].id) {
				let game = await this.boardModel.findOne({ id: board.id }).exec();

				player.hasLost = true;

				let nextP = nextPlayer(player, board.players);
				this.historyByBoard[board.id].push(new Action('DISCONNECTED'));
				console.log(player);
				console.log(nextP);
				this.nextActionByBoard[board.id] = new Action('TURN', nextP.id);

				game.markModified('players');
				game.save();
			} else {
				clearTimeout(timeout);
				this.kickPlayer(player, board);
			}
		}, 10000);
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
		this.historyByBoard[board.id] = [new Action('STARTED')];

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
				dices.reduce((a, b) => a + b, 0),
				board,
			);
			this.nextActionByBoard[payload.boardId] = newAction;
			this.historyByBoard[payload.boardId] =
				this.historyByBoard[payload.boardId].concat(actionsDone);

			const currentTile = board.tiles[currentPlayer.position];
			const owner = currentTile.owner;
			if (owner) {
				const action = owner === currentPlayer.id ? 'UPGRADE' : 'PAY';
				try {
					const tileHistory = this.tileAction(
						board,
						currentTile,
						currentPlayer,
						action,
					) as Action[];
					this.historyByBoard[payload.boardId] =
						this.historyByBoard[payload.boardId].concat(tileHistory);
				} catch (e: unknown) {
					throw e;
				}
			}
		}

		if (nextAction.description === 'BUY' && type === 'BUY') {
			const { amount } = payload;

			const [newAction, actionsDone] = this.tileAction(
				board,
				currentTile,
				currentPlayer,
				type,
				amount,
			);

			this.nextActionByBoard[payload.boardId] = newAction;
			this.historyByBoard[payload.boardId] =
				this.historyByBoard[payload.boardId].concat(actionsDone);
		}

		board.currentTurn = this.nextActionByBoard[payload.boardId].userConcerned;

		const winner = getWinner(board);
		if (winner) {
			this.nextActionByBoard[payload.boardId] = new Action('WIN', winner.id);
			this.historyByBoard[payload.boardId].push(new Action('WON', winner.id));
			setTimeout(() => {
				this.resetGame(board.id);
			}, 10000);
		}

		const userNextTurn = board.players.find(
			(p) => p.id === this.nextActionByBoard[board.id].userConcerned,
		);

		// this.kickPlayer(userNextTurn, board);

		board.markModified('players');
		board.markModified('tiles');
		board.markModified('ycircus');
		board.save();
		return this.gameOutput(payload.boardId);
	}

	tileAction(
		board: board,
		tile: tiles,
		player: player,
		action: 'BUY' | 'UPGRADE' | 'PAY',
		amount: number = undefined,
	): [Action, Action[]] | Action[] {
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
			const history = [];
			return [nextAction, history];
		}
	}
}
