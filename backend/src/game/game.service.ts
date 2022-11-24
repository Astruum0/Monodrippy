import { Injectable } from "@nestjs/common";
import { boardService } from "src/board/board.service";
import { gameOutput } from "src/models/gameOutput";

@Injectable()
export class gameService {
  constructor(
    private readonly boardService: boardService) {}

  async play(payload: IDicePlay): Promise<gameOutput> {
    return this.boardService.gameOutput(1);
  }
}