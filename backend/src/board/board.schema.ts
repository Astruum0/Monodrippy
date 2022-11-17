import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { luck } from 'src/luck/luck.schema';
import { tiles } from 'src/tiles/tiles.schema';
import { player } from 'src/player/player.schema';

export type boardDocument = board & mongoose.Document;

@Schema()
export class board {
  @Prop()
  id: number;
  
  @Prop()
  tiles: tiles;

  @Prop()
  hasStarted: boolean;

  @Prop()
  players: [player];

  @Prop()
  lucks: [luck];

  @Prop()
  ycircus: number;
}

export const boardSchema = SchemaFactory.createForClass(board);
