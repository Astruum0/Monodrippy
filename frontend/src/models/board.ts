import { dividePawns } from "@/lib/dividePawns"
import { P5Image, P5Sketch } from "vue-p5-component"
import { Luck } from "./luck"
import { Player } from "./player"
import { Tile } from "./tile"

export interface Board {

    id: number
    hasStarted: boolean

    players: [Player]
    lucks: [Luck]
    tiles: [Tile]

    ycircus: number
}

export class Board implements Board {
    id: number
    hasStarted: boolean

    players: [Player]
    lucks: [Luck]
    tiles: [Tile]

    ycircus: number

    static boardImg: P5Image | undefined
    static boardBackground: P5Image | undefined

    constructor(payload: Partial<Board>) {
        this.id = payload.id || 0
        this.hasStarted = payload.hasStarted || false
        this.players = new Array<Player>() as [Player]
        for (const [i, p] of (payload.players || Array<Player>() as [Player]).entries()) {
            this.players.push(new Player(p, i))
        }
        this.tiles = payload.tiles || new Array<Tile>() as [Tile]
        this.lucks = payload.lucks || new Array<Luck>() as [Luck]
        this.ycircus = payload.ycircus || 0
    }

    draw(sketch: P5Sketch) {
        sketch.push()
        sketch.translate(0, 2.5, 0)
        
        Board.boardBackground && sketch.texture(Board.boardBackground!)
        sketch.box(300, 5, 300)
        sketch.pop()
        
        sketch.push()
        sketch.rotateX(sketch.PI/2)
        sketch.translate(0, 0, 0.01)
        Board.boardImg && sketch.texture(Board.boardImg!)
        sketch.rect(-150, -150, 300, 300)
        sketch.pop()

        dividePawns(this.players)


        this.players.forEach(p => {
            p.draw(sketch)
        })
    } 
}