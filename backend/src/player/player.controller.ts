import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { player } from './player.schema';
import { playerService } from './player.service';

@Controller('players')
export class playerController {
  constructor(private readonly playerService: playerService) { }

  @Get()
  async findAll(): Promise<player[]> {
    return this.playerService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: Number,
  ): Promise<player> {
    console.log(id)
    return this.playerService.findById(id);
  }

  @Post('join/:id')
  async create(
    @Body() json: String,
    @Param('id') id: Number
  ) {
    let payload = {
      "name": json["name"],
      "money": 0,
      "properties": [],
      "isImprisoned": false,
      "hasGOOJCard": false
    }
    await this.playerService.addToGame(payload, id)
    return await this.playerService.create(payload);
  }
}