import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type serverDocument = server & mongoose.Document;

@Schema()
export class server {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  playersConnected: number;

  @Prop()
  status: string;
}

export const serverSchema = SchemaFactory.createForClass(server);
