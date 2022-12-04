import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from 'src/board/board.schema';
import { Action } from "src/models/action";
import { player, playerDocument } from 'src/player/player.schema';
import { tiles, tilesDocument } from './tiles.schema';
import { nextPlayer } from '../engine/playerMovement';
import { buyTile, payRent, upgradeTile } from 'src/engine/tileHandler';

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

  async tileAction(board_id: number, tile_id: number, player_id: string, action: "BUY" | "UPGRADE" | "PAY" | "NOT BUY", amount: number = undefined): Promise<[Action, Action[]]> {
    let game = await this.boardModel.findOne({
      id: board_id
    }).exec();
    let player = await this.playerModel.findOne({
      id: player_id
    }).exec();
    let index = this.findPlayerIndex(game, player.id)
    let game_tile = game["tiles"][tile_id]

    if (action == "BUY") {
      return buyTile(tile_id, player_id, game, player, game_tile, index, amount)
    } else if (action === "UPGRADE") {
      return upgradeTile(tile_id, player_id, game, player, game_tile, index)
    } else if (action === "PAY") {
      return payRent(tile_id, player_id, game, player, game_tile, index)
    } else if (action === "NOT BUY") {
      const nextAction = new Action("TURN", nextPlayer(game.players.find(p => p.id === player_id), game.players).id)
      const history = [new Action("NOT BOUGHT", player.id, tile_id)]
      return [nextAction, history]
    }
  }

  findPlayerIndex(game: any, player_id: string) {
    for (let index = 0; index < game["players"].length; index++) {
      if (game["players"][index].id == player_id) {
        return index
      }
    }
  }
}