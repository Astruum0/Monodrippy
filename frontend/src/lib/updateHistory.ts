import { Board } from "@/models/board";
import { Action } from "@/models/game";
import { Luck } from "@/models/luck";
import { Tile } from "@/models/tile";
import { Element } from "p5";
import { P5Sketch } from "vue-p5-component";

export function updateHistory(currenthistory: Action[], newHistory: Action[], historyDiv: Element, sketch: P5Sketch, board: Board) {
    const missedActions = newHistory.filter(a => !currenthistory.map(a => a.id).includes(a.id))

    for (const action of missedActions) {
        console.log(action);
        const pAction = sketch.createP(formatAction(action, board))
        historyDiv.html(`<p>${pAction.html()}</p>`, true)
    }
}

function formatAction(action: Action, board: Board): string {
    const userConcerned = board.players.find(p => p.id === action.userConcerned)
    let extraUtility: Tile | Luck | undefined
    const tileConcerned = board.tiles.find(e => e.id === action.extraValue)
    const luckConcerned = board.lucks.find(e => e.id === action.extraValue)

    const username = userConcerned?.name ?? "Inconnu"

    switch (action.description) {
        case "STARTED":
            return `La partie a commencé`
        case "MOVED":
            return `${username} est arrivé à ${tileConcerned?.name ?? "Inconnu"}`
        case "LUCK":
            return `${username} a pioché la carte ${luckConcerned?.name ?? "Inconnu"}`
        case "BOUGHT":
            return `${username} a acheté ${tileConcerned?.name ?? "Inconnu"} pour ${getTilePrice(tileConcerned!)}K`
        case "PAID":
            return `${username} a perdu ${action.extraValue}K`
        case "GAINED":
            return `${username} a gagné ${action.extraValue}K`
        case "LOST":
            return `${username} n'a pas les fonds nécessaires, il est éliminé (bozo)`
        case "IMPRISONED":
            return `${username} est emprisonné`
        case "WAITED":
            return `${username} n'a pas fait de double, il reste sagement en prison (bon toutou)`
        case "NEXTTHROW":
            return `Le lancer de ${username} est ${action.extraValue! > 1 ? "doublé" : "divisé par 2"}`
        default:
            return action.description
    }
}

function getTilePrice(tile: Tile): number {
    const upgradeCost = tile.type === "street" ? tile.prices.upgrade_cost * tile.currentLevel : 0
    return tile.prices.base + upgradeCost;
}