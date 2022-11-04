import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './create-player.dto';
import { player, playerDocument } from './player.schema';

@Injectable()
export class playerService {
  constructor(
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return createdPlayer.save();
  }

  async findAll(): Promise<player[]> {
    return this.playerModel.find().exec();
  }
}
