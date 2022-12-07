import { Board } from "@/models/board";
import { Action } from "@/models/game";
import { Luck } from "@/models/luck";

export function updateBoard(board: Board, newBoard: Board, history: Action[], newHistory: Action[], callback: (()=>void) | undefined = undefined) {
    const missedActions = newHistory.filter(a => !history.map(a => a.id).includes(a.id))

    if (missedActions.length > 0) {
        applyAction(board, missedActions, 0, callback)
        
    } else {
        callback && callback()
    }
}

function applyAction(board: Board, actions: Action[], index: number , callback: (()=>void) | undefined = undefined) {
    const currAction = actions[index]
    if (currAction) {
        if (currAction.description === "MOVED") {
            const p = board.players.find(p => p.id === currAction.userConcerned)
            p && currAction.extraValue && p.moveTo(currAction.extraValue, () => {
                applyAction(board, actions, index + 1, callback)
            })
        } else if (currAction.description === "LUCK") {
            const currentLuck = board.lucks.find(t => t.id === currAction.extraValue)
            Luck.div?.removeClass("invisible")
            Luck.title?.html(currentLuck?.name)
            Luck.desc?.html(currentLuck?.content)
            applyAction(board, actions, index + 1, callback)
        } else {
            applyAction(board, actions, index + 1, callback)
        }
    } else if (!currAction){
        console.log("all done")
        callback && callback()
    }
}