import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { player } from 'src/player/player.schema';

export type moduleDocument = module & mongoose.Document;

@Schema()
export class module {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'player' })
  owner: player;

  @Prop()
  upgrade: number;

  @Prop()
  value: number;

  @Prop()
  rent: number;
}

export const moduleSchema = SchemaFactory.createForClass(module);
