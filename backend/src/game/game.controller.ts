import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { gameService } from './game.service';
import { boardService } from '../board/board.service'
import { gameOutput } from 'src/models/gameOutput';

@Controller('game')
export class gameController {
  constructor(
    private readonly gameService: gameService) {}

  @Post('play')
  async play(@Body() payload:IDicePlay): Promise<gameOutput> {
    return this.gameService.play(payload)
  }
}