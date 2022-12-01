import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { gameService } from './game.service';
import { gameController } from './game.controller';
import { boardService } from "src/board/board.service";
import { boardModule } from "src/board/board.module";
import { board, boardSchema } from "src/board/board.schema";
import { player, playerSchema } from "src/player/player.schema";
import { playerModule } from "src/player/player.module";
import { playerService } from "src/player/player.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: board.name, schema: boardSchema }]),boardModule,
    MongooseModule.forFeature([{ name: player.name, schema: playerSchema }]),playerModule
  ],
  controllers: [gameController],
  providers: [gameService, boardService, playerService],
})
export class gameModule {}