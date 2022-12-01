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

  @Post(':id/tileaction')
  async tileAction(@Body() json: String, @Param('id') id: number) {
    let board_id = json["board_id"]
    let tile_id = id
    let player_id = json["player_id"]
    let action = json["action"]
    return await this.tilesService.tileAction(board_id, tile_id, player_id, action);
  }
}
