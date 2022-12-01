import { v4 as uuidv4 } from 'uuid';

export interface action {
  id: string
  description: string
  userConcerned: string | undefined
  tilesConcerned: number | undefined
}

export interface nextActionByBoard {
  [key: number]: action
}
export interface historyByBoard {
  [key: number]: action[]
}

export class Action implements action{
  id: string
  description: string
  userConcerned: string | undefined
  tilesConcerned: number | undefined

  constructor(
    description: string,
    userConcerned: string | undefined = undefined,
    tilesConcerned: number | undefined = undefined
    ) {
    this.id = uuidv4()
    this.description = description
    this.userConcerned = userConcerned
    this.tilesConcerned = tilesConcerned
  }
}