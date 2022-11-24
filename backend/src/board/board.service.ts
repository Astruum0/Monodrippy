import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, nextActionByBoard, historyByBoard } from 'src/models/action';
import { gameOutput } from 'src/models/gameOutput';
import { board, boardDocument } from './board.schema';

@Injectable()
export class boardService {
  historyByBoard: historyByBoard = {}
  nextActionByBoard: nextActionByBoard = {}

  constructor(
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
  ) {}

  async findAll(): Promise<board[]> {
    return this.boardModel.find().exec();
  }

  async findById(boardId: Number): Promise<board> {
    return this.boardModel.findOne({"id": boardId}).exec();
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
    this.historyByBoard = []
    board.hasStarted = false
    board.save();
    return player_id
  }

  async addToGame(payload: any, game_id: Number) {
    let board = await this.boardModel.findOne({ id: game_id }).exec();
    let player_number = board.players.length
    if(player_number <= 3){
        board.players.push(payload);
      return board.save();
    } else {
      throw new Error("Games already full")
    }
  }
  
  async gameOutput(id: Number): Promise<gameOutput> {
    return {
      nextAction: this.nextActionByBoard[id as number] || undefined,
      history: this.historyByBoard[id as number] || [],
      board: await this.findById(id)
    }
  }
}
