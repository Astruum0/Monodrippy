import { CallbackFunction } from "@/lib/callbackHelper"
import { P5Sketch } from "vue-p5-component"
import { Tile } from "./tile"

export interface Player {
    id: number
    name: string
    money: number
    position: number
    properties: [Tile]
    isImprisoned: number
    hasGOOJCard: boolean
}

export class Player implements Player {
    id: number
    name: string
    money: number
    position: number
    properties: [Tile]
    isImprisoned: number
    hasGOOJCard: boolean

    constructor(payload: Partial<Player>) {
        this.id = payload.id || 0
        this.name = payload.name || ""
        this.money = payload.money || 0
        this.position = payload.position || 0
        this.properties = payload.properties || new Array<Tile>() as [Tile]
        this.isImprisoned = payload.isImprisoned || 0
        this.hasGOOJCard = payload.hasGOOJCard || false
    }

    draw(sketch: P5Sketch) {
        console.log(this.name, sketch);
    }

    moveTo(destinationCase: number, callback: CallbackFunction) {
        let travellingDistance = destinationCase - this.position
        if (travellingDistance < 0) { travellingDistance = 36 - travellingDistance  }
        const travellingStep = travellingDistance / 100
        const movingInterval = setInterval(() => {
            this.position = (this.position + travellingStep) % 36
            if (this.position >= destinationCase) { 
                this.position = destinationCase
                clearInterval(movingInterval) 
                callback()
            } 
        }, 10)
    }
}