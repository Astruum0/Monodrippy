import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { luck } from './luck.schema';
import { luckService } from './luck.service';

@Controller('lucks')
export class luckController {
  constructor(private readonly luckService: luckService) {}

  @Get()
  async findAll(): Promise<luck[]> {
    return this.luckService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: Number,
  ): Promise<luck> {
    return this.luckService.findById(id);
  }


  @Post(':id/luckaction')
  async tileAction(@Body() json: String, @Param('id') id: number) {
    let board_id = json["board_id"]
    let luck_id = id
    let player_id = json["player_id"]
    return await this.luckService.luckAction(board_id, luck_id, player_id);
  }
}
