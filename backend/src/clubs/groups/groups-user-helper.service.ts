import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './schema/group.schema';

@Injectable()
export class GroupsUserHelperService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  async findGroupsByUser(userId: string) {
    // Busca grupos donde el usuario es coach o athlete
    return this.groupModel.find({
      $or: [
        { coaches: userId },
        { athletes: userId },
      ],
    }).populate('clubId');
  }
}
