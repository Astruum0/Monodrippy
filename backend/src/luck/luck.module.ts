import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { luckController } from './luck.controller';
import { luck, luckSchema } from './luck.schema';
import { luckService } from './luck.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: luck.name, schema: luckSchema }]),
  ],
  controllers: [luckController],
  providers: [luckService],
})
export class luckModule {}
