import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { gameService } from 'src/game/game.service';
import { player, playerSchema } from 'src/player/player.schema';
import { playerService } from 'src/player/player.service';
import { boardController } from './board.controller';
import { board, boardSchema } from './board.schema';
import { boardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: board.name, schema: boardSchema }]),
    MongooseModule.forFeature([{ name: player.name, schema: playerSchema }])
  ],
  controllers: [boardController],
  providers: [boardService, playerService],
})
export class boardModule {}
