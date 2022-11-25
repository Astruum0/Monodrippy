import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { board, boardDocument } from "src/board/board.schema";
import { boardService } from "src/board/board.service";
import { movePlayer } from "src/engine/engine";
import { Action, historyByBoard, nextActionByBoard } from "src/models/action";
import { gameOutput } from "src/models/gameOutput";
import { IDicePlay } from "src/models/IUserAction";

@Injectable()
export class gameService {
  historyByBoard: historyByBoard = {}
  nextActionByBoard: nextActionByBoard = {}

  constructor(
    @InjectModel(board.name) private boardModel: Model<boardDocument>
    ) {
      this.startGame(1)
    }

  async startGame(gameId: Number) {
    let board = await this.boardModel.findOne({ id: gameId }).exec();
    board.hasStarted = true
    
    board.currentTurn = board.players[Math.floor(Math.random() * board.players.length)].id

    this.nextActionByBoard[board.id] = new Action("TURN", board.currentTurn)
    this.historyByBoard[board.id] = [new Action("Game has started")]

    board.save();
  }

  async resetGame(gameId: Number) {
    let board = await this.boardModel.findOne({ id: gameId }).exec();
    let player_id = []
    for (let index = board.players.length; index > 0; index--) {
      player_id.push(board.players.pop()["id"]);
    }
    this.historyByBoard = {}
    board.hasStarted = false
    board.save();
    return player_id
  }

  async gameOutput(id: Number): Promise<gameOutput> {
    return {
      nextAction: this.nextActionByBoard[id as number] || undefined,
      history: this.historyByBoard[id as number] || [],
      board: await this.boardModel.findOne({"id": id}).exec()
    }
  }

  async play(payload: IDicePlay): Promise<gameOutput> {

    const nextAction = this.nextActionByBoard[payload.boardId]
    let board = await this.boardModel.findOne({ id: payload.boardId }).exec();
    const {userId, type} = payload

    if (nextAction.userConcerned !== userId) {
      throw new Error("Incorrect user turn")
    }

    if (nextAction.description !== type) {
      throw new Error(`Incorrect action type, expected ${nextAction.description}`)
    }
    
    if (nextAction.description === "TURN") {
      const {dices} = payload
      const [newAction, actionsDone] = movePlayer(userId, dices.reduce((a, b) => a + b, 0), board)

      this.nextActionByBoard[payload.boardId] = newAction
      this.historyByBoard[payload.boardId] = this.historyByBoard[payload.boardId].concat(actionsDone)
    }

    board.save()
    return this.gameOutput(payload.boardId)
  }

}