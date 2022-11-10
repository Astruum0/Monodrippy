import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { player } from 'src/player/player.schema';

export type serverDocument = server & mongoose.Document;

@Schema()
export class server {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop([player])
  playersConnected: player[];

  @Prop()
  status: string;
}

export const serverSchema = SchemaFactory.createForClass(server);
