import { board } from 'src/board/board.schema';
import { player } from 'src/player/player.schema';
import { Action } from 'src/models/action';
import { nextPlayer } from './playerMovement';


export function cvec(board: board, player: player): [Action, Action[]] {
	const history = [];

	player.money -= 80;
	player.position = 2

	history.push(new Action('PAID CVEC', player.id));

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
	let cost = 0

	let tilesOwned = board.tiles.filter((p) => p.owner === player.id)
	console.log(player.id)
	console.log(tilesOwned)
	for (let index = 0; index < tilesOwned.length; index++) {
		let tile = tilesOwned[index]
		cost += tile.rent[tile.currentLevel]
	}
	cost *= 0.20

	player.money -= cost
	player.position = 34

	history.push(new Action('PAID PRET ETUDIANT', player.id));

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