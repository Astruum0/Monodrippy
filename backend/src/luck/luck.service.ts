import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { luck, luckDocument } from './luck.schema';

@Injectable()
export class luckService {
  constructor(@InjectModel(luck.name) private luckModel: Model<luckDocument>) {}

  async findAll(): Promise<luck[]> {
    return this.luckModel.find().exec();
  }
<<<<<<< HEAD
=======

  async findById(luckId: string): Promise<luck> {
    return this.luckModel.findOne({"id": luckId}).exec();
  }
>>>>>>> feat/databaseConnection
}
