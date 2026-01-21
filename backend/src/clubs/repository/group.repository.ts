/**
 * Repository para Group
 * Gestiona operaciones CRUD en la base de datos
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from '../schemas/group.schema';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';

@Injectable()
export class GroupRepository {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  /**
   * Crear un nuevo grupo
   */
  async create(createGroupDto: CreateGroupDto, userId: string): Promise<Group> {
    const group = new this.groupModel({
      ...createGroupDto,
      club_id: new Types.ObjectId(createGroupDto.club_id),
      created_by: new Types.ObjectId(userId),
      members: [new Types.ObjectId(userId)], // El creador es miembro
    });

    return group.save();
  }

  /**
   * Obtener todos los grupos de un club
   */
  async findByClub(clubId: string): Promise<Group[]> {
    return this.groupModel
      .find({
        club_id: new Types.ObjectId(clubId),
      })
      .populate('created_by', 'email name')
      .populate('members', 'email name')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener un grupo por ID
   */
  async findById(groupId: string): Promise<Group | null> {
    return this.groupModel
      .findById(groupId)
      .populate('created_by', 'email name')
      .populate('members', 'email name')
      .populate('club_id', 'name')
      .exec();
  }

  /**
   * Actualizar un grupo
   */
  async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group | null> {
    try {
      return await this.groupModel.findByIdAndUpdate(groupId, updateGroupDto, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      console.error('Error en update del repository:', error);
      throw error;
    }
  }

  /**
   * Eliminar un grupo
   */
  async delete(groupId: string): Promise<Group | null> {
    try {
      return await this.groupModel.findByIdAndDelete(groupId, { new: true });
    } catch (error) {
      console.error('Error en delete del repository:', error);
      throw error;
    }
  }

  /**
   * Verificar si un grupo pertenece a un club
   */
  async belongsToClub(groupId: string, clubId: string): Promise<boolean> {
    const group = await this.groupModel.findOne({
      _id: new Types.ObjectId(groupId),
      club_id: new Types.ObjectId(clubId),
    });

    return !!group;
  }

  /**
   * Obtener grupos creados por un usuario
   */
  async findByCreator(userId: string): Promise<Group[]> {
    return this.groupModel
      .find({
        created_by: new Types.ObjectId(userId),
      })
      .populate('club_id', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Contar grupos en un club
   */
  async countByClub(clubId: string): Promise<number> {
    return this.groupModel.countDocuments({
      club_id: new Types.ObjectId(clubId),
    });
  }

  /**
   * Añadir miembro a un grupo
   */
  async addMember(groupId: string, memberId: string): Promise<Group | null> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: new Types.ObjectId(memberId) } },
      { new: true },
    );
  }

  /**
   * Remover miembro de un grupo
   */
  async removeMember(groupId: string, memberId: string): Promise<Group | null> {
    return this.groupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: new Types.ObjectId(memberId) } },
      { new: true },
    );
  }
}
