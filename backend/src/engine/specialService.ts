import { board } from 'src/board/board.schema';
import { player } from 'src/player/player.schema';
import { Action } from 'src/models/action';
import { nextPlayer } from './playerMovement';


export function cvec(board: board, player: player, history: Action[]): [Action, Action[]] {
	let price = 80

	if (player.money >= price) {
		player.money -= price
		history.push(new Action(`PAID`, player.id, price));
	} else {
		price = player.money
		player.money -= price
		player.hasLost = true
		history.push(new Action(`LOST`, player.id));
	}
	
	board.ycircus += price
	player.position = 2

	return [
		new Action(
			'TURN',
			nextPlayer(
				board.players.find((p) => p.id === player.id),
				board.players,
			).id,
		),
		history,
	];
}

export function pretEtudiant(board: board, player: player, history: Action[]): [Action, Action[]] {
	let price = 0

	let tilesOwned = board.tiles.filter((p) => p.owner === player.id)
	for (let index = 0; index < tilesOwned.length; index++) {
		let tile = tilesOwned[index]
		price += tile.rent[tile.currentLevel]
	}
	price *= 0.20

	if (player.money >= price) {
		player.money -= price
		history.push(new Action(`PAID`, player.id, price));
	} else {
		player.money = 0
		player.hasLost = true
		history.push(new Action(`LOST`, player.id));
	}

	player.position = 34

	return [
		new Action(
			'TURN',
			nextPlayer(
				board.players.find((p) => p.id === player.id),
				board.players,
			).id,
		),
		history,
	];
}

export function yCircus(board: board, player: player, history: Action[]): [Action, Action[]] {
	player.position = 18
	player.money += board.ycircus
	history.push(new Action(`GAINED`, player.id, board.ycircus));
	board.ycircus = 0

	return [
		new Action(
			'TURN',
			nextPlayer(
				board.players.find((p) => p.id === player.id),
				board.players,
			).id,
		),
		history,
	];
}