import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { module, moduleDocument } from './module.schema';

@Injectable()
export class moduleService {
  constructor(
    @InjectModel(module.name) private moduleModel: Model<moduleDocument>,
  ) {}

  async findAll(): Promise<module[]> {
    return this.moduleModel.find().exec();
  }
}
