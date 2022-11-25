export interface IUserAction {
    userId: string
    boardId: number
    type: "TURN" | "PAY"
}


export interface IStreetAction extends IUserAction {
    answer: number
}

export interface IDicePlay extends IUserAction {
    dices: number[]
}