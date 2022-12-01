import { CallbackFunction } from "@/lib/callbackHelper"
import { convertCaseToCoords } from "@/lib/convertPositionToCoords"
import { P5Geometry, P5Sketch } from "vue-p5-component"
import { Tile } from "./tile"

const pawnColors = [
    [51, 102, 255],
    [255, 0, 0],
    [0, 204, 0],
    [255, 153, 255]
]

export interface Player {
    id: string
    name: string
    money: number
    position: number
    properties: [Tile]
    isImprisoned: number
    hasGOOJCard: boolean
}

export class Player implements Player {
    id: string
    name: string
    money: number
    position: number
    properties: [Tile]
    isImprisoned: number
    hasGOOJCard: boolean

    color: number[]
    currentHeight = 0

    static model: P5Geometry | undefined = undefined

    constructor(payload: Partial<Player>, colorIndex = 0) {
        this.id = payload.id || ""
        this.name = payload.name || ""
        this.money = payload.money || 0
        this.position = payload.position || 0
        this.properties = payload.properties || new Array<Tile>() as [Tile]
        this.isImprisoned = payload.isImprisoned || 0
        this.hasGOOJCard = payload.hasGOOJCard || false

        this.color = pawnColors[colorIndex]
        
    }

    draw(sketch: P5Sketch) {
        const coords = convertCaseToCoords(this.position)

        sketch.push()
        sketch.fill(this.color)
        sketch.translate(coords.x, -this.currentHeight * 24, coords.y);
        sketch.rotateZ(sketch.PI)
        this.currentHeight % 2 == 1 && sketch.rotateZ(sketch.PI) && sketch.translate(0, -24, 0)
        sketch.scale(5)
        
        Player.model && sketch.model(Player.model)
        sketch.pop()
    }

    moveTo(destinationCase: number, callback: CallbackFunction | undefined = undefined) {
        let travellingDistance = destinationCase - this.position
        if (travellingDistance < 0) { travellingDistance = 36 - travellingDistance  }
        const travellingStep = travellingDistance / 50
        const movingInterval = setInterval(() => {
            this.position = (this.position + travellingStep) % 36
            if (this.position >= destinationCase - 0.3 && this.position <= destinationCase + 0.3) { 
                this.position = Math.trunc(destinationCase)
                clearInterval(movingInterval) 
                callback && callback()
            } 
        }, 10)
    }
}