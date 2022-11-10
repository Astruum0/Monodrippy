import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type luckDocument = luck & mongoose.Document;

@Schema()
export class luck {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  content: string;

  @Prop()
  keep: boolean;
}

export const luckSchema = SchemaFactory.createForClass(luck);
