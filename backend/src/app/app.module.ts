import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { playerModule } from 'src/player/player.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.01/monodrippy'),
    playerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
