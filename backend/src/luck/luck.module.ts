import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { board, boardSchema } from 'src/board/board.schema';
import { player, playerSchema } from 'src/player/player.schema';
import { luckController } from './luck.controller';
import { luck, luckSchema } from './luck.schema';
import { luckService } from './luck.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: luck.name, schema: luckSchema }]),
    MongooseModule.forFeature([{ name: board.name, schema: boardSchema }]),
    MongooseModule.forFeature([{ name: player.name, schema: playerSchema }]),
  ],
  controllers: [luckController],
  providers: [luckService],
})
export class luckModule {}
