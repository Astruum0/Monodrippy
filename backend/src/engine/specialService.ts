import { board } from 'src/board/board.schema';
import { player } from 'src/player/player.schema';
import { Action } from 'src/models/action';
import { nextPlayer } from './playerMovement';


export function cvec(board: board, player: player): [Action, Action[]] {
	const history = [];
	let price = 80

	if (player.money >= price) {
		player.money -= price
		history.push(new Action(`PAID CVEC ${price}`, player.id));
	} else {
		player.money = 0
		player.hasLost = true
		history.push(new Action(`LOST GAME`, player.id));
	}
	
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

export function pretEtudiant(board: board, player: player): [Action, Action[]] {
	const history = [];
	let price = 0

	let tilesOwned = board.tiles.filter((p) => p.owner === player.id)
	console.log(player.id)
	console.log(tilesOwned)
	for (let index = 0; index < tilesOwned.length; index++) {
		let tile = tilesOwned[index]
		price += tile.rent[tile.currentLevel]
	}
	price *= 0.20

	if (player.money >= price) {
		player.money -= price
		history.push(new Action(`PAID PRET ETUDIANT ${price}`, player.id));
	} else {
		player.money = 0
		player.hasLost = true
		history.push(new Action(`LOST GAME`, player.id));
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