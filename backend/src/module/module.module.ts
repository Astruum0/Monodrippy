import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { moduleController } from './module.controller';
import { module, moduleSchema } from './module.schema';
import { moduleService } from './module.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: module.name, schema: moduleSchema }]),
  ],
  controllers: [moduleController],
  providers: [moduleService],
})
export class moduleModule {}
