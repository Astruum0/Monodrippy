import { Controller, Get } from '@nestjs/common';
import { module } from './module.schema';
import { moduleService } from './module.service';

@Controller('modules')
export class moduleController {
  constructor(private readonly moduleService: moduleService) {}

  @Get()
  async findAll(): Promise<module[]> {
    return this.moduleService.findAll();
  }
}
