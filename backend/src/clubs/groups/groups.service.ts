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

  findByClub(clubId: string, requestingUser?: { sub: string; role: string }) {
    // Obtener todos los grupos del club
    const query = this.groupModel.find({ clubId }).populate('coaches athletes');

    // Si no es superadmin, filtrar por active = true
    if (!requestingUser || requestingUser.role !== 'superadmin') {
      // Agregar condición al query para sólo grupos activos
      return this.groupModel
        .find({ clubId, active: true })
        .populate('coaches athletes');
    }

    return query;
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
    // Populate coaches and athletes before returning
    await group.populate('coaches athletes');
    return group;
  }

  findOneByClub(clubId: string, id: string) {
    return this.groupModel
      .findOne({ _id: id, clubId })
      .populate('coaches athletes');
  }

  updateByClub(clubId: string, id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupModel
      .findOneAndUpdate({ _id: id, clubId }, updateGroupDto, {
        new: true,
      })
      .populate('coaches athletes');
  }

  async removeByClub(clubId: string, id: string) {
    // Soft-delete: marcar active = false
    const group = await this.groupModel
      .findOneAndUpdate({ _id: id, clubId }, { active: false }, { new: true })
      .populate('coaches athletes');
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

  /**
   * Restaurar (reactivar) un grupo eliminado (active = true)
   * y volver a agregar la referencia del grupo en el club si es necesario
   */
  async restoreByClub(clubId: string, id: string) {
    // Reactivar el grupo
    const group = await this.groupModel
      .findOneAndUpdate({ _id: id, clubId }, { active: true }, { new: true })
      .populate('coaches athletes');

    // Volver a agregar la referencia en el club (usar $addToSet para evitar duplicados)
    if (group) {
      const ClubModel = this.groupModel.db.model('Club');
      await ClubModel.findByIdAndUpdate(
        clubId,
        { $addToSet: { groups: group._id } },
        { new: true },
      );
    }

    return group;
  }
}
