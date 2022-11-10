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
  color: string;

  @Prop()
  prices: {
    base: number;
    upgradeCost: number;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'player' })
  owner: player;

  @Prop()
  upgrade: number;

  @Prop()
  value: number;

  @Prop()
  rent: {
    base: number;
    level1: number;
    level2: number;
    level3: number;
    level4: number;
  };

  @Prop()
  type: string;
}

export const moduleSchema = SchemaFactory.createForClass(module);
