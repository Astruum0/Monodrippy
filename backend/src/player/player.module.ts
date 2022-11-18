import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { board, boardSchema } from 'src/board/board.schema';
import { boardService } from '../board/board.service';
import { playerController } from './player.controller';
import { player, playerSchema } from './player.schema';
import { playerService } from './player.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: player.name, schema: playerSchema }]),
    MongooseModule.forFeature([{ name: board.name, schema: boardSchema }])
  ],
  controllers: [playerController],
  providers: [playerService, boardService],
})
export class playerModule {}
