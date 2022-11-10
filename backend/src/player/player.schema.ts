import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { module } from 'src/module/module.schema';

export type playerDocument = player & mongoose.Document;

@Schema()
export class player {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  money: number;

  @Prop([module])
  properties: module[];

  @Prop()
  isImprisoned: number;

  @Prop()
  hasGOOJCard: boolean;
}

export const playerSchema = SchemaFactory.createForClass(player);
