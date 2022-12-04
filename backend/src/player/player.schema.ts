import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { tiles } from 'src/tiles/tiles.schema';
import { Any } from 'typeorm';

export type playerDocument = player & mongoose.Document;

@Schema()
export class player {
	@Prop()
	id: string;

	@Prop()
	name: string;

	@Prop()
	money: number;

	@Prop()
	turnsInPrison: number;

	@Prop()
	hasGOOJCard: boolean;

	@Prop({ type: Any })
	position: tiles['id'];

	@Prop()
	nextThrowModifier: number;
}

export const playerSchema = SchemaFactory.createForClass(player);
