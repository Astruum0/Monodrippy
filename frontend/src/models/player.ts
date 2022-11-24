import { Tile } from "./tile"

export interface Player {
    id: number
    name: string
    money: number
    properties: [Tile]
    isImprisoned: number
    hasGOOJCard: boolean
}