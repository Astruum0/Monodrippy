import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePlayerDto } from './create-player.dto';
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
    @Param('id') id: string,
  ): Promise<player> {
    console.log(id)
    return this.playerService.findById(id);
  }

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playerService.create(createPlayerDto);
  }
}

