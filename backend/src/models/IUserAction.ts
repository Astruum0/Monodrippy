export interface IUserAction {
    userId: string
    boardId: number
}

export interface ITileAction extends IUserAction {
    amount: number
    type: "BUY" | "NOT BUY"
}

export interface IDicePlay extends IUserAction {
    dices: number[]
    type: "TURN"
}