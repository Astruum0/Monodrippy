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
}