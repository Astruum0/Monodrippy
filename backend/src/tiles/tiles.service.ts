import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from 'src/board/board.schema';
import { Action } from "src/models/action";
import { player, playerDocument } from 'src/player/player.schema';
import { tiles, tilesDocument } from './tiles.schema';
import { nextPlayer } from '../engine/playerMovement';
import { buyTile, findPlayerIndex, payRent, upgradeTile } from 'src/engine/tileHandler';

@Injectable()
export class tilesService {
  constructor(
    @InjectModel(tiles.name) private tilesModel: Model<tilesDocument>,
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
  ) { }

  async findAll(): Promise<tiles[]> {
    return this.tilesModel.find().exec();
  }

  async findById(tileId: Number): Promise<tiles> {
    return this.tilesModel.findOne({ "id": tileId }).exec();
  }
}