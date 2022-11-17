import { Luck } from "./luck"
import { Player } from "./player"
import { Tile } from "./tile"

export class Board {

    id: number
    hasStarted: boolean

    players: [Player]
    lucks: [Luck]
    tiles: [Tile]

    ycircus: number
}