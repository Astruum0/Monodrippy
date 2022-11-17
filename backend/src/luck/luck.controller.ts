<<<<<<< HEAD
import { Controller, Get } from '@nestjs/common';
=======
import { Controller, Get, Param } from '@nestjs/common';
>>>>>>> feat/databaseConnection
import { luck } from './luck.schema';
import { luckService } from './luck.service';

@Controller('lucks')
export class luckController {
  constructor(private readonly luckService: luckService) {}

  @Get()
  async findAll(): Promise<luck[]> {
    return this.luckService.findAll();
  }
<<<<<<< HEAD
=======

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<luck> {
    return this.luckService.findById(id);
  }
>>>>>>> feat/databaseConnection
}
