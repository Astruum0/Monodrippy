import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { player } from 'src/player/player.schema';
import { board, boardDocument } from './board.schema';

@Injectable()
export class boardService {
  constructor(
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
  ) {}

  async findAll(): Promise<board[]> {
    return this.boardModel.find().exec();
  }

  async findById(boardId: Number): Promise<board> {
    return this.boardModel.findOne({"id": boardId}).exec();
  }

  async resetGame(gameId: Number) {
    let board = await this.boardModel.findOne({ id: gameId }).exec();
    for (let index = board.players.length; index >= 0; index--) {
      board.players.pop();
    }
    board.hasStarted = false
    board.save();
  }
}
