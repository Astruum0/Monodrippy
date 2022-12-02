import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { board, boardSchema } from 'src/board/board.schema';
import { player, playerSchema } from 'src/player/player.schema';
import { tilesController } from './tiles.controller';
import { tiles, tilesSchema } from './tiles.schema';
import { tilesService } from './tiles.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: tiles.name, schema: tilesSchema }]),
    MongooseModule.forFeature([{ name: board.name, schema: boardSchema }]),
    MongooseModule.forFeature([{ name: player.name, schema: playerSchema }]),
  ],
  controllers: [tilesController],
  providers: [tilesService],
})
export class tilesModule {}
