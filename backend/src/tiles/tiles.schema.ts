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

  @Prop({type:Any})
  prices: {
    base: number;
    upgradeCost: number;
  };

  @Prop({type:Any})
  owner: player['id'];

  @Prop({type:Any})
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

export const tilesSchema = SchemaFactory.createForClass(tiles);
