import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from './board.schema';

@Injectable()
export class boardService {
  constructor(
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
  ) {}

  async findAll(): Promise<board[]> {
    return this.boardModel.find().exec();
  }

  async findById(tilesId: string): Promise<board> {
    return this.boardModel.findOne({"id": tilesId}).exec();
  }
}
