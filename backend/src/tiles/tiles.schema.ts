import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { player } from 'src/player/player.schema';

export type tilesDocument = tiles & mongoose.Document;

@Schema()
export class tiles {
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

<<<<<<< HEAD:backend/src/module/module.schema.ts
  @Prop()
  owner: player['id'];

=======
>>>>>>> 10e1736 (added plein de json sa mere):backend/src/tiles/tiles.schema.ts
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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'player' })
  owner: player;
}

export const tilesSchema = SchemaFactory.createForClass(tiles);
