import { board } from 'src/board/board.schema';
import { player } from 'src/player/player.schema';
import { Action } from 'src/models/action';
import { movePlayer, nextPlayer } from './playerMovement';

export function goToJail(board: board, player: player): [Action, Action[]] {
	const history = [];

	history.push(new Action('MOVED', player.id, 27));

	player.position = 9;
	player.turnsInPrison = 3;

	history.push(new Action('IMPRISONED', player.id));

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

export function turnInJail(
	board: board,
	player: player,
	diceThrow: number[],
): [Action, Action[]] {
	const history = [];
	const currentPlayer = board.players.find((p) => p.id === player.id);
	const newPlayer = nextPlayer(currentPlayer, board.players);
	let nextAction: Action;

	if (currentPlayer.turnsInPrison == 0 || diceThrow[0] == diceThrow[1]) {
		currentPlayer.turnsInPrison = 0;

		return movePlayer(
			currentPlayer.id,
			diceThrow.reduce((a, b) => a + b, 0),
			board,
		);
	} else {
		currentPlayer.turnsInPrison -= 1;
		history.push(
			new Action('WAITED', currentPlayer.id, currentPlayer.position),
		);
	}

	nextAction = new Action('TURN', newPlayer.id);

	return [nextAction, history];
}
