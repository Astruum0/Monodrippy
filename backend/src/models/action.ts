import { v4 as uuidv4 } from 'uuid';

export interface action {
  id: string
  description: string
  userConcerned: string | undefined
  extraValue: number | undefined
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
  extraValue: number | undefined

  constructor(
    description: string,
    userConcerned: string | undefined = undefined,
    extraValue: number | undefined = undefined
    ) {
    this.id = uuidv4()
    this.description = description
    this.userConcerned = userConcerned
    this.extraValue = extraValue
  }
}