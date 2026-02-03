import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Level } from '../schemas/level.schema';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';

@Injectable()
export class LevelsRepository {
  constructor(@InjectModel(Level.name) private levelModel: Model<Level>) {}

  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const level = new this.levelModel(createLevelDto);
    return level.save();
  }

  async findAll(): Promise<Level[]> {
    return this.levelModel
      .find()
      .populate('group_id')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Level | null> {
    return this.levelModel.findById(id).populate('group_id').exec();
  }

  async findByGroupId(groupId: string): Promise<Level | null> {
    return this.levelModel
      .findOne({ group_id: groupId })
      .populate('group_id')
      .exec();
  }

  async update(
    id: string,
    updateLevelDto: UpdateLevelDto,
  ): Promise<Level | null> {
    return this.levelModel
      .findByIdAndUpdate(id, updateLevelDto, { new: true, runValidators: true })
      .populate('group_id')
      .exec();
  }

  async delete(id: string): Promise<Level | null> {
    return this.levelModel.findByIdAndDelete(id).exec();
  }

  async findByName(name: string): Promise<Level | null> {
    return this.levelModel.findOne({ name }).populate('group_id').exec();
  }

  async deleteByGroupId(groupId: string): Promise<any> {
    return this.levelModel.deleteOne({ group_id: groupId }).exec();
  }
}
