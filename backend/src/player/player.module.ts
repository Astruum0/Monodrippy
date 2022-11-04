import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { playerController } from './player.controller';
import { player, playerSchema } from './player.schema';
import { playerService } from './player.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: player.name, schema: playerSchema }]),
  ],
  controllers: [playerController],
  providers: [playerService],
})
export class playerModule {}
