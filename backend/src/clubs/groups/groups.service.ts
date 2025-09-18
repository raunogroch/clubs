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
    return this.groupModel.find({ clubId }).populate('coaches athletes');
  }

  async createForClub(clubId: string, createGroupDto: CreateGroupDto) {
    // Crear el grupo y obtener el documento creado
    const group = await this.groupModel.create({ ...createGroupDto, clubId });
    // Actualizar el club para agregar la referencia del grupo
    const ClubModel = this.groupModel.db.model('Club');
    await ClubModel.findByIdAndUpdate(
      clubId,
      { $push: { groups: group._id } },
      { new: true },
    );
    return group;
  }

  findOneByClub(clubId: string, id: string) {
    return this.groupModel.findOne({ _id: id, clubId });
  }

  updateByClub(clubId: string, id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupModel.findOneAndUpdate(
      { _id: id, clubId },
      updateGroupDto,
      {
        new: true,
      },
    );
  }

  async removeByClub(clubId: string, id: string) {
    // Eliminar el grupo
    const group = await this.groupModel.findOneAndDelete({ _id: id, clubId });
    // Eliminar la referencia del grupo en el club
    if (group) {
      const ClubModel = this.groupModel.db.model('Club');
      await ClubModel.findByIdAndUpdate(
        clubId,
        { $pull: { groups: group._id } },
        { new: true },
      );
    }
    return group;
  }
}
