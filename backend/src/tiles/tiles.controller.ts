import { Controller, Get, Param } from '@nestjs/common';
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
    @Param('id') id: string,
  ): Promise<tiles> {
    return this.tilesService.findById(id);
  }
}
