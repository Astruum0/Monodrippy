import { Injectable } from "@nestjs/common";
import { boardService } from "src/board/board.service";
import { gameOutput } from "src/models/gameOutput";
import { IDicePlay } from "src/models/IDicePlay";

@Injectable()
export class gameService {
  constructor(
    private readonly boardService: boardService) {}

  async play(payload: IDicePlay) {
    const {id, dices} = payload
    return {playerId: id, length: dices.reduce((a, b) => a + b, 0)};
  }
}