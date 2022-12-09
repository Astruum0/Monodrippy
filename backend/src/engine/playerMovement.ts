import { board } from 'src/board/board.schema';
import { Action } from 'src/models/action';
import { player } from 'src/player/player.schema';
import { goToJail } from './jailService';
import { cvec, pretEtudiant, yCircus } from './specialService';
import { luckAction } from './luckHandler';
import { isBuyable } from './tileHandler';

export function movePlayer(
	userId: string,
	distance: number,
	board: board,
	history: Action[] = []
): [Action, Action[]] {
	const currentPlayer = board.players.find((p) => p.id === userId);

	currentPlayer.nextThrowModifier !== 1 && history.push(new Action("NEXTTHROW", currentPlayer.id, currentPlayer.nextThrowModifier))
	distance = Math.ceil(distance * currentPlayer.nextThrowModifier)
	
	let gainedMoney: number
	if (currentPlayer.position + distance == 36) {
		currentPlayer.money += 400;
		gainedMoney = 400
	} else if (currentPlayer.position + distance > 36) {
		currentPlayer.money += 200;
		gainedMoney = 200
	}

	currentPlayer.position = (currentPlayer.position + distance) % 36;
	history.length === 0 && history.push(new Action('MOVED', currentPlayer.id, currentPlayer.position));
	currentPlayer.nextThrowModifier = 1
	gainedMoney && history.push(new Action('GAINED', currentPlayer.id, gainedMoney));

	
	if (currentPlayer.position === 2) {
		return cvec(board, currentPlayer, history);
	} else if (currentPlayer.position === 18) {
		return yCircus(board, currentPlayer, history);
	} else if (currentPlayer.position === 27) {
		return goToJail(board, currentPlayer, history);
	} else if (currentPlayer.position === 34) {
		return pretEtudiant(board, currentPlayer, history);
	}

	let nextAction: Action;

	if (isBuyable(board.tiles[currentPlayer.position])) {
		nextAction = new Action(
			'BUY',
			currentPlayer.id,
			currentPlayer.position,
		);
	} else if(board.tiles[currentPlayer.position].type === "chance") {
		return luckAction(board, currentPlayer, history)
	} else {
		const newPlayer = nextPlayer(currentPlayer, board.players);
		nextAction = new Action('TURN', newPlayer.id);
	}

	return [nextAction, history];
}

export function nextPlayer(player: player, allPlayers: player[]): player {
	const index = allPlayers.indexOf(player);
	const nextP = allPlayers[(index + 1) % allPlayers.length];
	return nextP.hasLost ? nextPlayer(nextP, allPlayers) : nextP
}
