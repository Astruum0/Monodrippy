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

  async luckAction(board_id: number, luck_id: number, player_id: string) {
    let game = await this.boardModel.findOne({
      id: board_id
    }).exec();
    let player = await this.playerModel.findOne({
      id: player_id
    }).exec();
    let index = this.findPlayerIndex(game, player.id)

    let luck = game["lucks"][luck_id]
    let effect = luck.cardEffect["effect"]
    let value = luck.cardEffect["value"]
    switch (effect) {
      case "loseMoney":
        game["players"][index].money -= value
        break;
      case "gainMoney":
        game["players"][index].money += value
        break;
      case "moveTo":
        if (game["players"][index].position > value) {
          game["players"][index].money += 150
        }
        game["players"][index].position = value
        break;
      case "moveToStraight":
        game["players"][index].position = value
        break;
      case "nextThrow":
        game["players"][index].nextThrowModifier = value
        break;
      case "wait":
        // TODO
        break;
      default:
        return new Error("No such effect")
    }
    game.markModified("players")
    game.save()
  }


  findPlayerIndex(game: any, player_id: string) {
    for (let index = 0; index < game["players"].length; index++) {
      if (game["players"][index].id == player_id) {
        return index
      }
    }
  }
}
