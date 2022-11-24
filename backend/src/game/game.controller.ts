import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { gameService } from './game.service';
import { boardService } from '../board/board.service'
import { gameOutput } from 'src/models/gameOutput';
import { IDicePlay } from 'src/models/IDicePlay';

@Controller('game')
export class gameController {
  constructor(
    private readonly gameService: gameService) {}

  @Post('play')
  async play(@Body() payload:IDicePlay) {
    return this.gameService.play(payload)
  }
}