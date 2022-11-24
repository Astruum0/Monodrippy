import { board } from "src/board/board.schema"
import { action } from "./action"

  
export interface gameOutput {
    history: action[]
    board: board
  }