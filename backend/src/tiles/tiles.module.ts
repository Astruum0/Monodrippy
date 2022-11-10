import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { tilesController } from './tiles.controller';
import { tiles, tilesSchema } from './tiles.schema';
import { tilesService } from './tiles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: tiles.name, schema: tilesSchema }]),
  ],
  controllers: [tilesController],
  providers: [tilesService],
})
export class tilesModule {}
