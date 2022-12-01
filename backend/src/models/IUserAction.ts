export interface IUserAction {
    userId: string
    boardId: number
    type: "TURN" | "BUY"
}


export interface IStreetAction extends IUserAction {
    answer: number
}

export interface IDicePlay extends IUserAction {
    dices: number[]
}