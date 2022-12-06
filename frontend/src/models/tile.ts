import { tilesStartCoords } from "@/lib/convertTileToCoords"
import { BIconTextareaResize } from "bootstrap-vue"
import { Vector } from "p5"
import { P5Sketch } from "vue-p5-component"
import { Board } from "./board"
import { Player } from "./player"

export interface Tile {
    id: number
    name: string
    color: string
    prices: TilePrice
    owner: string
    currentLevel: number
    rent: number[]
    type: string
}

interface TilePrice {
    base: number
    upgrade_cost: number
}

export class Tile implements Tile {
    constructor(payload: Partial<Tile>) {
        this.id = payload.id as number
        this.name = payload.name as string
        this.color = payload.color as string
        this.prices = payload.prices as TilePrice
        this.owner = payload.owner as string
        this.currentLevel = payload.currentLevel as number
        this.rent = payload.rent as number[]
        this.type = payload.type as string
    }

    draw(sketch: P5Sketch, owner: Player, board: Board) {
        const side = Math.floor(this.id / 9)
        const positionRelativeToSide = this.id % 9
        const coords = new Vector(tilesStartCoords[side].x, tilesStartCoords[side].y)
        const extraCoords = positionRelativeToSide * 26
        const textCoords = {x: 0, y: 0}
        const offsetAxe = side % 2 ? "y" : "x"
        if (side === 0) { 
            coords.x -= extraCoords
            textCoords.x = coords.x - 13
            textCoords.y = coords.y - 2
        } else if (side === 1) { 
            coords.y -= extraCoords
            textCoords.x = coords.x + 2
            textCoords.y = coords.y - 13
        } else if (side === 2) {
            coords.x += extraCoords
            textCoords.x = coords.x + 13
            textCoords.y = coords.y + 2
        } else if (side === 3) {
            coords.y += extraCoords
            textCoords.x = coords.x - 2
            textCoords.y = coords.y + 13
        }

        sketch.push()
        sketch.textSize(5)    
        sketch.fill(0)
        sketch.translate(textCoords.x, -0.1, textCoords.y)
        sketch.rotateX(sketch.PI/2)
        sketch.rotateZ(side * sketch.PI / 2)
        sketch.textAlign(sketch.CENTER)
        const rentIndex = this.type === "gare" ? board.getNumberOfTrainStation(this.owner)-1 : this.currentLevel
        
        sketch.text(`${this.rent[rentIndex]}K`, 0, 0, 26)
        sketch.pop()

        coords[offsetAxe] -= rentIndex * 2.5        

        for (let i = 0; i < rentIndex + 1; i++) {
            sketch.push()
            sketch.fill(owner.color)
            sketch.translate(coords.x, 2.5, coords.y)
            sketch.sphere(2.5)
            sketch.pop()
            
            coords[offsetAxe] += 5
        }
    }
}