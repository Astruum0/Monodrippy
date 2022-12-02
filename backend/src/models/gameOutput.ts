import { board } from "src/board/board.schema"
import { action } from "./action"

  
export interface gameOutput {
    history: action[]
    nextAction: action | undefined
    board: board
  }