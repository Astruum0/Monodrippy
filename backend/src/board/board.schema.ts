import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { luck } from 'src/luck/luck.schema';
import { module } from 'src/module/module.schema';
import { player } from 'src/player/player.schema';

export type boardDocument = board & mongoose.Document;

@Schema()
export class board {
  @Prop()
  street: module;

  @Prop()
  player: player;

  @Prop()
  luck: luck;

  @Prop()
  ycircus: number;
}

export const boardSchema = SchemaFactory.createForClass(board);
