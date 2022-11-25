import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { gameOutput } from 'src/models/gameOutput';
import { board } from './board.schema';
import { boardService } from './board.service';
import { playerService } from 'src/player/player.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('boards')
export class boardController {
  constructor(
    private readonly boardService: boardService,
    private readonly playerService: playerService
  ) {}

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

  @Post('join/:id')
  async create(@Body() json: String, @Param('id') id: Number) {
    let payload = {
      id: uuidv4(),
      name: json['name'],
      money: 1500,
      properties: [],
      isImprisoned: false,
      hasGOOJCard: false,
      position: 0
    };
    try {
      await this.boardService.addToGame(payload, id)
      return await this.playerService.create(payload);
    }
    catch(e: unknown) {
      return {"error": typeof e === "string" ? e.toUpperCase() : e instanceof Error ? e.message : "Error"}
    }
  }
}

