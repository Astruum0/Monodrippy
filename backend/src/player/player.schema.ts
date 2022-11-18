import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { tiles } from 'src/tiles/tiles.schema';

export type playerDocument = player & mongoose.Document;

@Schema()
export class player {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  money: number;

  @Prop([tiles])
  properties: tiles[];

  @Prop()
  isImprisoned: number;

  @Prop()
  hasGOOJCard: boolean;
}

export const playerSchema = SchemaFactory.createForClass(player);
