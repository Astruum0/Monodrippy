import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { action } from 'src/models/action';
import { gameOutput } from 'src/models/gameOutput';
import { board, boardDocument } from './board.schema';
import { playerService } from 'src/player/player.service';
import { player, playerDocument } from 'src/player/player.schema';

@Injectable()
export class boardService {
  actions: action[] = new Array<action>()

  constructor(
    @InjectModel(board.name) private boardModel: Model<boardDocument>,
  ) {}

  async findAll(): Promise<board[]> {
    return this.boardModel.find().exec();
  }

  async findById(boardId: Number): Promise<board> {
    return this.boardModel.findOne({"id": boardId}).exec();
  }

  async startGame(gameId: Number) {
    let board = await this.boardModel.findOne({ id: gameId }).exec();
    board.hasStarted = true
    board.save();
  }

  async resetGame(gameId: Number) {
    let board = await this.boardModel.findOne({ id: gameId }).exec();
    let player_id = []
    for (let index = board.players.length; index > 0; index--) {
      player_id.push(board.players.pop()["id"]);
    }
    board.hasStarted = false
    board.save();
    return player_id
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
  
  async gameOutput(id: Number): Promise<gameOutput> {
    return {
      history: this.actions.filter(e => {e.boardId === id}),
      board: await this.findById(id)
    }
  }
}
