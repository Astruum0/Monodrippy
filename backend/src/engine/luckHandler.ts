import { board } from "src/board/board.schema";
import { luck } from "src/luck/luck.schema";
import { Action } from "src/models/action";
import { player } from "src/player/player.schema";
import { movePlayer, nextPlayer } from "./playerMovement";

export function luckAction(board: board, player: player, history: Action[]): [Action, Action[]] {
    const luckCard = getRandomLuckCard(board);
    const effect = luckCard.cardEffect.effect
    const value = luckCard.cardEffect.value
    history.push(new Action("LUCK", player.id, luckCard.id))    

    switch (effect) {
        case "loseMoney":
            player.money -= value
            history.push(new Action(`LOST ${value}`, player.id));
            break;
        case "gainMoney":
            player.money += value
            history.push(new Action(`GAINED ${value}`, player.id));
            break;
        case "moveTo":
            history.push(new Action('MOVED', player.id, value));
            if (player.position > value) {
                player.money += 150
                history.push(new Action(`GAINED ${value}`, player.id));
            }
            player.position = value
            return movePlayer(player.id, 0, board, history)
        case "moveToStraight":
            player.position = value
            history.push(new Action('MOVED STRAIGHT', player.id, player.position));
            return movePlayer(player.id, 0, board, history)
        case "nextThrow":
            history.push(new Action("Next throw will be " + (value > 1 ? "doubled" : "divided by 2")))
            player.nextThrowModifier = value
            break;
        default:
            throw new Error("No such effect")
    }
    const newPlayer = nextPlayer(player, board.players);
	return [new Action('TURN', newPlayer.id), history];
    
}

function getRandomLuckCard(board: board): luck {
    return board.lucks[Math.floor(Math.random() * board.lucks.length)]
}