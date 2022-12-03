import { board } from "src/board/board.schema";
import { Action } from "src/models/action";
import { player } from "src/player/player.schema";
import { isBuyable } from "./streetHandler";

export function movePlayer(userId: string, distance: number, board: board): [Action, Action[]] {

    const currentPlayer = board.players.filter(p => p.id === userId)[0]
    if(currentPlayer.position + distance == 36){
        currentPlayer.money += 400
    } else if(currentPlayer.position + distance > 36){
        currentPlayer.money += 200
    }
    currentPlayer.position = (currentPlayer.position + distance) % 36
    const history = []
    history.push(new Action("MOVED", currentPlayer.id, currentPlayer.position))

    let nextAction: Action

    if(isBuyable(board.tiles[currentPlayer.position])) {
        nextAction = new Action("BUY", currentPlayer.id, currentPlayer.position)
    } else {
        nextAction = new Action("TURN", nextPlayer(currentPlayer, board.players).id)
    }
    
    return [nextAction, history]


}

export function nextPlayer(player: player, allPlayers: player[]): player {

    const index = allPlayers.indexOf(player)

    return allPlayers[(index + 1) % allPlayers.length]


}