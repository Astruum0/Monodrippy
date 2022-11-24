import { v4 as uuidv4 } from 'uuid';

export interface action {
  id: string
  userConcerned: string | undefined
  description: string
}

export interface nextActionByBoard {
  [key: number]: action
}
export interface historyByBoard {
  [key: number]: action[]
}

export class Action implements action{
  id: string
  userConcerned: string | undefined
  description: string

  constructor(
    description: string,
    userConcerned: string | undefined = undefined
    ) {
    this.id = uuidv4()
    this.description = description
    this.userConcerned = userConcerned
  }
}