import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { boardController } from './board.controller';
import { board, boardSchema } from './board.schema';
import { boardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: board.name, schema: boardSchema }]),
  ],
  controllers: [boardController],
  providers: [boardService],
})
export class boardModule {}
