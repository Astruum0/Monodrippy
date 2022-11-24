import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { player } from 'src/player/player.schema';
import { action } from 'src/models/action';
import { gameOutput } from 'src/models/gameOutput';
import { board, boardDocument } from './board.schema';

@Injectable()
export class boardService {
  actions: action[] = new Array<action>()

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
    board.save();
  }

  async resetGame(gameId: Number) {
    let board = await this.boardModel.findOne({ id: gameId }).exec();
    for (let index = board.players.length; index >= 0; index--) {
      board.players.pop();
    }
    board.hasStarted = false
    board.save();
  }
  
  async gameOutput(id: Number): Promise<gameOutput> {
    return {
      history: this.actions.filter(e => {e.boardId === id}),
      board: await this.findById(id)
    }
  }
}
