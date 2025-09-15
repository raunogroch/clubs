import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './schema/group.schema';
import { Model } from 'mongoose';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  findByClub(clubId: string) {
    return this.groupModel.find({ club: clubId });
  }

  createForClub(clubId: string, createGroupDto: CreateGroupDto) {
    return this.groupModel.create({ ...createGroupDto, club: clubId });
  }

  findOneByClub(clubId: string, id: string) {
    return this.groupModel.findOne({ _id: id, club: clubId });
  }

  updateByClub(clubId: string, id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupModel.findOneAndUpdate(
      { _id: id, club: clubId },
      updateGroupDto,
      {
        new: true,
      },
    );
  }

  removeByClub(clubId: string, id: string) {
    return this.groupModel.findOneAndDelete({ _id: id, club: clubId });
  }
}
