import { Tile } from "./tile"

export class Player {
    id: number
    name: string
    money: number
    properties: [Tile]
    isImprisoned: number
    hasGOOJCard: boolean
}