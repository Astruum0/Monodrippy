import { board } from 'src/board/board.schema';
import { Action } from 'src/models/action';
import { player } from 'src/player/player.schema';
import { goToJail } from './jailService';
import { isBuyable } from './tileHandler';

export function movePlayer(
	userId: string,
	distance: number,
	board: board,
): [Action, Action[]] {
	const currentPlayer = board.players.find((p) => p.id === userId);
	if (currentPlayer.position + distance == 36) {
		currentPlayer.money += 300;
	} else if (currentPlayer.position + distance > 36) {
		currentPlayer.money += 150;
	}

	currentPlayer.position = (currentPlayer.position + distance) % 36;
	const history = [];
	history.push(new Action('MOVED', currentPlayer.id, currentPlayer.position));

	if (currentPlayer.position == 27) {
		return goToJail(board, currentPlayer);
	}

	let nextAction: Action;

	if (isBuyable(board.tiles[currentPlayer.position])) {
		nextAction = new Action('BUY', currentPlayer.id, currentPlayer.position);
	} else {
		const newPlayer = nextPlayer(currentPlayer, board.players);
		nextAction = new Action('TURN', newPlayer.id);
	}

	return [nextAction, history];
}

export function nextPlayer(player: player, allPlayers: player[]): player {
	const index = allPlayers.indexOf(player);
	return allPlayers[(index + 1) % allPlayers.length];
}
