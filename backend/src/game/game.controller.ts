import { Controller, Get, Param } from '@nestjs/common';
import { gameService } from './game.service';
import { boardService } from '../board/board.service'
import { gameOutput } from 'src/models/gameOutput';

@Controller('game')
export class gameController {
  constructor(
    private readonly gameService: gameService) {}

  @Get()
  async play(): Promise<gameOutput> {
    return this.gameService.play()
  }
}