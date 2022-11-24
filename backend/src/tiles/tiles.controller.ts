import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { tiles } from './tiles.schema';
import { tilesService } from './tiles.service';

@Controller('tiles')
export class tilesController {
  constructor(private readonly tilesService: tilesService) {}

  @Get()
  async findAll(): Promise<tiles[]> {
    return this.tilesService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: Number,
  ): Promise<tiles> {
    return this.tilesService.findById(id);
  }

  @Post(':id/buy')
  async create(@Body() json: String, @Param('id') id: number) {
    let game_id = json["game_id"]
    let tile_id = id
    let player_id = json["player_id"]
    return await this.tilesService.buy(game_id, tile_id, player_id);
  }
}
