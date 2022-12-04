import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { luck, luckDocument } from './luck.schema';
import { board, boardDocument } from "src/board/board.schema";
import { Action } from "src/models/action";
import { player, playerDocument } from "src/player/player.schema";

@Injectable()
export class luckService {
  constructor(
    @InjectModel(luck.name) private luckModel: Model<luckDocument>,
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
  ) { }

  async findAll(): Promise<luck[]> {
    return this.luckModel.find().exec();
  }

  async findById(luckId: Number): Promise<luck> {
    return this.luckModel.findOne({ "id": luckId }).exec();
  }
}
