import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { player, playerDocument } from './player.schema';
import { boardService } from '../board/board.service';
import { board, boardDocument } from 'src/board/board.schema';
import { Console } from 'console';

@Injectable()
export class playerService {
  constructor(
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
    private readonly boardService: boardService,
  ) {}

  async create(payload: any): Promise<player> {
    const createdPlayer = new this.playerModel(payload);
    return createdPlayer.save();
  }

  async addToGame(payload: any, game_id: Number) {
    let board = await this.boardModel.findOne({ id: game_id }).exec();
    let player_number = board.players.length
    if(player_number <= 3){
        board.players.push(payload);
      return board.save();
    } else {
      throw new Error("Games already full")
    }

  }

  async findAll(): Promise<player[]> {
    return this.playerModel.find().exec();
  }

  async findById(playerId: Number): Promise<player> {
    return this.playerModel.findOne({ id: playerId }).exec();
  }
}
