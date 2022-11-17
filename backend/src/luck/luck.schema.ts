import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
<<<<<<< HEAD
=======
import { Any } from 'typeorm';
>>>>>>> feat/databaseConnection

export type luckDocument = luck & mongoose.Document;

@Schema()
export class luck {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  content: string;

<<<<<<< HEAD
  @Prop()
  keep: boolean;

  @Prop()
=======
  @Prop({ type: Any })
>>>>>>> feat/databaseConnection
  cardEffect: {
    effect: string;
    value: number;
  };
}

export const luckSchema = SchemaFactory.createForClass(luck);
