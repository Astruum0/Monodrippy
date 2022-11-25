import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { gameService } from './game.service';
import { gameController } from './game.controller';
import { boardService } from "src/board/board.service";
import { boardModule } from "src/board/board.module";
import { board, boardSchema } from "src/board/board.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: board.name, schema: boardSchema }]),boardModule],
  controllers: [gameController],
  providers: [gameService, boardService],
})
export class gameModule {}