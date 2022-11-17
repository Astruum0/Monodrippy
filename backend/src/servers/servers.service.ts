import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { server, serverDocument } from './servers.schema';

@Injectable()
export class serverService {
  constructor(
    @InjectModel(server.name) private serverModel: Model<serverDocument>,
  ) {}

  async findAll(): Promise<server[]> {
    return this.serverModel.find().exec();
  }

  async findById(serverId: string): Promise<server> {
    return this.serverModel.findOne({"id": serverId}).exec();
  }
}
