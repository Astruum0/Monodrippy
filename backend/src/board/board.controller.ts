import { Controller, Get } from '@nestjs/common';
import { board } from './board.schema';
import { boardService } from './board.service';

@Controller('boards')
export class boardController {
  constructor(private readonly boardService: boardService) {}

  @Get()
  async findAll(): Promise<board[]> {
    return this.boardService.findAll();
  }
}
