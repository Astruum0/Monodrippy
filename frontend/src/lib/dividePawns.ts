import { Player } from "@/models/player";

export function dividePawns(players: [Player]) {
    players.map((p) => p.currentHeight = 0)
    const positionRepartition: {[position: number]: [Player]} = {}
    for (const p of players) {
        positionRepartition[p.position] ? positionRepartition[p.position].push(p) : positionRepartition[p.position] = [p]
    }
    for (const key of Object.keys(positionRepartition) as []) {
        
        if (positionRepartition[key].length > 1) {
            for (const [i, p] of positionRepartition[key].entries()) {
                p.currentHeight = i
            }
            
            
        }
    }

    // console.log(positionRepartition);
    
}