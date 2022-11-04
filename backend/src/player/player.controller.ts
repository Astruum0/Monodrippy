import { Controller, Get } from '@nestjs/common';
import { player } from './player.schema';
import { playerService } from './player.service';

@Controller('players')
export class playerController {
  constructor(private readonly playerService: playerService) {}

  @Get()
  async findAll(): Promise<player[]> {
    return this.playerService.findAll();
  }
}
