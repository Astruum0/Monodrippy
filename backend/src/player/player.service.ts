import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { player, playerDocument } from './player.schema';
import { boardService } from '../board/board.service';
import { board, boardDocument } from 'src/board/board.schema';

@Injectable()
export class playerService {
  constructor(
    @InjectModel(player.name) private playerModel: Model<playerDocument>,
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
    private readonly boardService: boardService
  ) {}

  async create(payload: any): Promise<player> {
    const createdPlayer = new this.playerModel(payload);
    return createdPlayer.save();
  }

  async add_to_game(payload: any, game_id: Number) {
    let board = await this.boardModel.findOne({"id": game_id}).exec()
    board.players.push(payload)
    return board.save()
  }

  async findAll(): Promise<player[]> {
    return this.playerModel.find().exec();
  }

  async findById(playerId: Number): Promise<player> {
    return this.playerModel.findOne({"id": playerId}).exec();
  }
}
