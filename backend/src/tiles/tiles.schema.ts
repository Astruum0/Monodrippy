import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { player } from 'src/player/player.schema';
import { Any } from 'typeorm';

export type tilesDocument = tiles & mongoose.Document;

@Schema()
export class tiles {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  color: string;

  @Prop({ type: Any })
  prices: {
    base: number;
    upgradeCost: number;
  };

  @Prop()
  owner: player['id'];

  @Prop()
  rent: [number];

  @Prop()
  type: string;

  @Prop()
  currentLevel: number;
}

export const tilesSchema = SchemaFactory.createForClass(tiles);
