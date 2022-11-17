import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { boardModule } from 'src/board/board.module';
import { luckModule } from 'src/luck/luck.module';
import { tilesModule } from 'src/tiles/tiles.module';
import { playerModule } from 'src/player/player.module';
import { serverModule } from 'src/servers/servers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/monodrippy'),
    boardModule,
    playerModule,
    luckModule,
    tilesModule,
    serverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
