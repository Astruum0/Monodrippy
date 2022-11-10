import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { serverController } from './servers.controller';
import { server, serverSchema } from './servers.schema';
import { serverService } from './servers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: server.name, schema: serverSchema }]),
  ],
  controllers: [serverController],
  providers: [serverService],
})
export class serverModule {}
