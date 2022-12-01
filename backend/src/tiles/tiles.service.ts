import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board, boardDocument } from 'src/board/board.schema';
import { Action } from "src/models/action";
import { player, playerDocument } from 'src/player/player.schema';
import { tiles, tilesDocument } from './tiles.schema';
import { nextPlayer } from '../engine/engine';

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

  async tileAction(board_id: number, tile_id: number, player_id: string, action: string): Promise<[Action, Action[]]> {
    let game = await this.boardModel.findOne({
      id: board_id
    }).exec();
    let player = await this.playerModel.findOne({
      id: player_id
    }).exec();
    let index = this.findPlayerIndex(game, player.id)
    let game_tile = game["tiles"][tile_id]

    if (action == "buy") {
      return this.buy(tile_id, player_id, game, player, game_tile, index)
    } else if (action == "upgrade") {
      return this.upgrade(tile_id, player_id, game, player, game_tile, index)
    } else if (action == "pay_rent") {
      return this.payRent(tile_id, player_id, game, player, game_tile, index)
    }
  }

  buy(tile_id: number, player_id: string, game: any, player: player, game_tile: tiles, index: number): [Action, Action[]] {
    const history = []
    if(game_tile.owner == null){
      if (game_tile.type == "street") {
        if (game_tile.prices["base"] <= player.money) {
          game["tiles"][tile_id].currentLevel = 1
          game["tiles"][tile_id].owner = player_id
          game["players"][index].money -= game_tile.prices["base"]
          game["players"][index].properties.push(game_tile)
          game.markModified("tiles")
          game.markModified("players")
          game.save()
          history.push(new Action("BOUGHT", player.id, tile_id))
          return [new Action("TURN", nextPlayer(game.players.filter(p => p.id === player_id)[0], game.players).id), history]
        } else {
          throw new Error("Not enough money")
        }
      } else if (game_tile.type == "gare") {
        if (game_tile.prices["base"] <= player.money) {
          game["tiles"][tile_id].owner = player_id
          game["players"][index].money -= game_tile.prices["base"]
          game["players"][index].properties.push(game_tile)
          game.markModified("tiles")
          game.markModified("players")
          game.save()
          history.push(new Action("BOUGHT", player.id, tile_id))
          return [new Action("TURN", nextPlayer(game.players.filter(p => p.id === player_id)[0], game.players).id), history]
        } else {
          throw new Error("Not enough money")
        }
      } else {
        throw new Error("Not buyable, not a street or gare")
      }
    } else {
      throw new Error("Not buyable, already bought")
    }
  }

  upgrade(tile_id: number, player_id: string, game: any, player: player, game_tile: tiles, index: number): [Action, Action[]] {
    const history = []

    if (game_tile.type == "street") {
      if (game_tile.currentLevel != 0 && game_tile.currentLevel <= 3) {
        if (game_tile.prices["upgrade_cost"] <= player.money) {
          game["tiles"][tile_id].currentLevel += 1
          game["players"][index].money -= game_tile.prices["upgrade_cost"]
          game.markModified("tiles")
          game.markModified("players")
          game.save()
          history.push(new Action("UPGRADED", player.id, tile_id))
          return [new Action("TURN", nextPlayer(game.players.filter(p => p.id === player_id)[0], game.players).id), history]
        } else {
          throw new Error("Not enough money")
        }
      } else {
        throw new Error("Can't upgrade, wrong level")
      }
    } else {
      throw new Error("Can't upgrade, not a street")
    }
  }

  payRent(tile_id: number, player_id: string, game: any, player: player, game_tile: tiles, index: number): [Action, Action[]] {
    return 
  }

  findPlayerIndex(game: any, player_id: Number) {
    for (let index = 0; index < game["players"].length; index++) {
      if (game["players"][index].id == player_id) {
        return index
      }
    }
  }
}