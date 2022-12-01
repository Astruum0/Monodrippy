import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action, nextActionByBoard, historyByBoard } from 'src/models/action';
import { gameOutput } from 'src/models/gameOutput';
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
}
