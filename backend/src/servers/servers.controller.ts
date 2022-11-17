import { Controller, Get, Param } from '@nestjs/common';
import { server } from './servers.schema';
import { serverService } from './servers.service';

@Controller('servers')
export class serverController {
  constructor(private readonly serverService: serverService) {}

  @Get()
  async findAll(): Promise<server[]> {
    return this.serverService.findAll();
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
  ): Promise<server> {
    return this.serverService.findById(id);
  }
}
