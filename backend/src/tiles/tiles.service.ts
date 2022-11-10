import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { tiles, tilesDocument } from './tiles.schema';

@Injectable()
export class tilesService {
  constructor(
    @InjectModel(tiles.name) private tilesModel: Model<tilesDocument>,
  ) {}

  async findAll(): Promise<tiles[]> {
    return this.tilesModel.find().exec();
  }
}
