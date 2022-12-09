import { CallbackFunction } from "@/lib/callbackHelper"
import { convertCaseToCoords } from "@/lib/convertPositionToCoords"
import { P5Geometry, P5Sketch } from "vue-p5-component"
import { Tile } from "./tile"

const pawnColors = [
    [51, 102, 255],
    [245, 176, 65],
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
    hasLost: boolean
    nextThrowModifier: number
}

export class Player implements Player {
    color: number[]
    currentHeight = 0

    jumpingCoord = 0;

    static model: P5Geometry | undefined = undefined

    constructor(payload: Partial<Player>, colorIndex = 0) {
        this.id = payload.id || ""
        this.name = payload.name || ""
        this.money = payload.money || 0
        this.position = payload.position || 0
        this.properties = payload.properties || new Array<Tile>() as [Tile]
        this.isImprisoned = payload.isImprisoned || 0
        this.hasLost = payload.hasLost || false
        this.nextThrowModifier = payload.nextThrowModifier || 1;

        this.color = pawnColors[colorIndex]
        
    }

    draw(sketch: P5Sketch) {
        const coords = convertCaseToCoords(this.position)

        sketch.push()
        sketch.fill(this.color)
        sketch.translate(coords.x, -(this.currentHeight * 24) - this.jumpingCoord, coords.y);
        sketch.rotateZ(sketch.PI)
        this.currentHeight % 2 == 1 && sketch.rotateZ(sketch.PI) && sketch.translate(0, -24, 0)
        sketch.scale(5)
        
        Player.model && sketch.model(Player.model)
        sketch.pop()
    }

    moveTo(destinationCase: number, callback: CallbackFunction | undefined = undefined) {
        const movingInterval = setInterval(() => {
            this.position = (this.position + 0.1) % 36
            const decimal = this.position - Math.floor(this.position)
            this.jumpingCoord = Math.sin(decimal * Math.PI) * 8
            
            if (this.position >= destinationCase - 0.01 && this.position <= destinationCase + 0.01) { 
                this.position = Math.trunc(destinationCase)
                clearInterval(movingInterval) 
                callback && callback()
            } 
        }, 20)
    }
}