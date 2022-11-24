import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { board } from './board.schema';
import { boardService } from './board.service';

@Controller('boards')
export class boardController {
  constructor(private readonly boardService: boardService) {}

  @Get()
  async findAll(): Promise<board[]> {
    return this.boardService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: Number,
  ): Promise<board> {
    return this.boardService.findById(id);
  }

  @Delete('reset/:id')
  async resetGame(@Param('id') id: Number) {
    return this.boardService.resetGame(id);
  }
}
