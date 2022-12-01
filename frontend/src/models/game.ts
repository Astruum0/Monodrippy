import { Board } from "./board"


export interface Game {
    history: Action[]
    nextAction: Action | undefined
    board: Board
  }

  export interface Action {
    id: string
    description: string
    userConcerned: string | undefined
    tilesConcerned: number | undefined
  }
  