import { Player } from "./player"

export interface Tile {
    id: number
    name: string
    color: string
    prices: TilePrice
    owner: Player

    rent: [number]
}

interface TilePrice {
    base: number
    upgradeCost: number
}
