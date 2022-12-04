import { tilesStartCoords } from "@/lib/convertTileToCoords"
import { Vector } from "p5"
import { P5Sketch } from "vue-p5-component"
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

    draw(sketch: P5Sketch, owner: Player) {
        const side = Math.floor(this.id / 9)
        const positionRelativeToSide = this.id % 9
        const coords = new Vector(tilesStartCoords[side].x, tilesStartCoords[side].y)
        const extraCoords = positionRelativeToSide * 26
        if (side === 0) { 
            coords.x -= extraCoords
        } else if (side === 1) { 
            coords.y -= extraCoords
        } else if (side === 2) {
            coords.x += extraCoords
        } else {
            coords.y += extraCoords
        }
        
        sketch.push()
        sketch.fill(owner.color)
        sketch.translate(coords.x, 2.5, coords.y)
        sketch.sphere((this.currentLevel + 1) * 2.5)
        sketch.pop()
    }
}