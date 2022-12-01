import { board } from "src/board/board.schema";
import { Action } from "src/models/action";
import { player } from "src/player/player.schema";

export function movePlayer(userId: string, distance: number, board: board): [Action, Action[]] {

    const currentPlayer = board.players.filter(p => p.id === userId)[0]
    currentPlayer.position += distance

    const newPlayer = nextPlayer(currentPlayer, board.players)
    
    const history = []
    history.push(new Action("MOVED", newPlayer.id, currentPlayer.position))

    return [new Action("TURN", newPlayer.id), history]


}

function nextPlayer(player: player, allPlayers: player[]): player {

    const index = allPlayers.indexOf(player)

    return allPlayers[index + 1 % allPlayers.length]


}