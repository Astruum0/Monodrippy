import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from 'src/board/board.schema';
import { player, playerDocument } from 'src/player/player.schema';
import { tiles, tilesDocument } from './tiles.schema';

@Injectable()
export class tilesService {
  constructor(
    @InjectModel(tiles.name) private tilesModel: Model<tilesDocument>,
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
  ) {}

  async findAll(): Promise<tiles[]> {
    return this.tilesModel.find().exec();
  }

  async findById(tileId: Number): Promise<tiles> {
    return this.tilesModel.findOne({"id": tileId}).exec();
  }

  async buy(game_id: number, tile_id: number, player_id: string) {
    let game = await this.boardModel.findOne({ id: game_id }).exec();
    let player = await this.playerModel.findOne({ id: player_id }).exec();
    let game_tile = game["tiles"][tile_id]
    if(game_tile.prices["base"] <= player.money){
      console.log("ok")
    } else {
      console.log("pas ok")
    }
  }
}
