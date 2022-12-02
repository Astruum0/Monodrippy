import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { player, playerDocument } from './player.schema';

@Injectable()
export class playerService {
  constructor(
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
  ) {}

  async create(payload: any): Promise<player> {
    const createdPlayer = new this.playerModel(payload);
    return createdPlayer.save();
  }

  async findAll(): Promise<player[]> {
    return this.playerModel.find().exec();
  }

  async findById(playerId: Number): Promise<player> {
    return this.playerModel.findOne({ id: playerId }).exec();
  }

  async deleteById(playerId: string) {
    return this.playerModel.remove({ id: playerId }).exec();
  }
}
