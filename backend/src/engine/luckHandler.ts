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
            if (player.money >= value) {
                player.money -= value
                history.push(new Action(`PAID`, player.id, value));
            } else {
                player.money = 0
                player.hasLost = true
                history.push(new Action(`LOST`, player.id));
            }
            break;
        case "gainMoney":
            player.money += value
            history.push(new Action(`GAINED`, player.id, value));
            break;
        case "moveTo":
            history.push(new Action('MOVED', player.id, value));
            if (player.position > value) {
                player.money += 150
                history.push(new Action(`GAINED`, player.id, value));
            }
            player.position = value
            return movePlayer(player.id, 0, board, history)
        case "moveToStraight":
            player.position = value
            history.push(new Action('MOVED', player.id, player.position));
            return movePlayer(player.id, 0, board, history)
        case "nextThrow":
            player.nextThrowModifier = value
            break;
        default:
            console.log(luckCard);
            throw new Error("No such effect")
    }
    const newPlayer = nextPlayer(player, board.players);
	return [new Action('TURN', newPlayer.id), history];
    
}

function getRandomLuckCard(board: board): luck {
    // return board.lucks.find(l => l.id === 5);
    return board.lucks[Math.floor(Math.random() * board.lucks.length)]
}