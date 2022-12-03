import { tiles } from "src/tiles/tiles.schema";

export function isBuyable(tile: tiles): boolean {
    return tile.owner === null && typeof tile.owner !== 'undefined'
}