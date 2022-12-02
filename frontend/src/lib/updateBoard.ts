import { Board } from "@/models/board";
import { Action } from "@/models/game";

export function updateBoard(board: Board, newBoard: Board, history: Action[], newHistory: Action[]) {
    const missedActions = newHistory.filter(a => !history.map(a => a.id).includes(a.id))

    if (missedActions.length > 0) {
        applyAction(board, missedActions, 0, newBoard)
    } else {
        board = newBoard
    }
}

function applyAction(board: Board, actions: Action[], index: number, lastBoardState: Board) {
    const currAction = actions[index]
    if (currAction) {
        if (currAction.description === "MOVED") {
            const p = board.players.find(p => p.id === currAction.userConcerned)
            p && currAction.tilesConcerned && p.moveTo(currAction.tilesConcerned, () => {
                applyAction(board, actions, index + 1, lastBoardState)
            })
        } else {
            applyAction(board, actions, index + 1, lastBoardState)
        }
    } else if (!currAction){
        console.log("all done")
        board = lastBoardState
    }
}