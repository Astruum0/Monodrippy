import { board } from "src/board/board.schema";
import { player } from "src/player/player.schema";

export function getWinner(board: board): player {
    const playersStillIn = board.players.filter(p => !p.hasLost)
    return playersStillIn.length === 1 ?  playersStillIn[0] : undefined
}