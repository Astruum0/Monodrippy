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
  ): Promise<gameOutput> {
    return this.boardService.gameOutput(id);
  }

  @Patch('start/:id')
  async startGame(@Param('id') id: Number) {
    return this.boardService.startGame(id);
  }

  @Delete('reset/:id')
  async resetGame(@Param('id') id: Number) {
    let players_id = await this.boardService.resetGame(id);
    console.log(players_id)
    for(let id in players_id){
      this.playerService.deleteById(players_id[id])
    }
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
    };
    console.log(payload)
    try {
      await this.boardService.addToGame(payload, id)
      return await this.playerService.create(payload);
    }
    catch(err) {
      return {"error": "Game already full"}
    }
  }
}

