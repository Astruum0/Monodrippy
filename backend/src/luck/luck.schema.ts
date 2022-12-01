import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Any } from 'typeorm';

export type luckDocument = luck & mongoose.Document;

@Schema()
export class luck {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop({ type: Any })
  cardEffect: {
    effect: string;
    value: number;
  };
}

export const luckSchema = SchemaFactory.createForClass(luck);
