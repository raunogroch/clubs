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
      .populate('created_by', 'name')
      .populate('athletes', 'name role ci lastname')
      .populate('coaches', 'name role ci lastname')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener un grupo por ID
   */
  async findById(groupId: string): Promise<Group | null> {
    return this.groupModel
      .findById(groupId)
      .populate('created_by', 'name')
      .populate('athletes', 'name role ci lastname')
      .populate('coaches', 'name role ci lastname')
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
   * Añadir atleta a un grupo
   */
  async addAthlete(groupId: string, athleteId: string): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(
          groupId,
          { $addToSet: { athletes: new Types.ObjectId(athleteId) } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate('athletes', 'name role ci lastname')
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .exec();
    } catch (error) {
      console.error('Error en addAthlete del repository:', error);
      throw error;
    }
  }

  /**
   * Remover atleta de un grupo
   */
  async removeAthlete(
    groupId: string,
    athleteId: string,
  ): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(
          groupId,
          { $pull: { athletes: new Types.ObjectId(athleteId) } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate('athletes', 'name role ci lastname')
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .exec();
    } catch (error) {
      console.error('Error en removeAthlete del repository:', error);
      throw error;
    }
  }

  /**
   * Añadir entrenador a un grupo
   */
  async addCoach(groupId: string, coachId: string): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(
          groupId,
          { $addToSet: { coaches: new Types.ObjectId(coachId) } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate('athletes', 'name role ci lastname')
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .exec();
    } catch (error) {
      console.error('Error en addCoach del repository:', error);
      throw error;
    }
  }

  /**
   * Remover entrenador de un grupo
   */
  async removeCoach(groupId: string, coachId: string): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(
          groupId,
          { $pull: { coaches: new Types.ObjectId(coachId) } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate('athletes', 'name role ci lastname')
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .exec();
    } catch (error) {
      console.error('Error en removeCoach del repository:', error);
      throw error;
    }
  }

  /**
   * Añadir miembro a un grupo (legacy - mantener para compatibilidad)
   */
  async addMember(
    groupId: string,
    memberId: string,
    role?: string,
  ): Promise<Group | null> {
    try {
      if (role === 'coach') {
        return await this.addCoach(groupId, memberId);
      } else if (role === 'athlete') {
        return await this.addAthlete(groupId, memberId);
      }
      // Si no hay rol, intentar determinar por contexto o fallar
      throw new Error('Role is required for addMember');
    } catch (error) {
      console.error('Error en addMember del repository:', error);
      throw error;
    }
  }

  /**
   * Remover miembro de un grupo (legacy - mantener para compatibilidad)
   */
  async removeMember(
    groupId: string,
    memberId: string,
    role?: string,
  ): Promise<Group | null> {
    try {
      if (role === 'coach') {
        return await this.removeCoach(groupId, memberId);
      } else if (role === 'athlete') {
        return await this.removeAthlete(groupId, memberId);
      }
      // Si no hay rol, intentar remover de ambos arrays
      let result = await this.groupModel
        .findByIdAndUpdate(
          groupId,
          {
            $pull: {
              athletes: new Types.ObjectId(memberId),
              coaches: new Types.ObjectId(memberId),
            },
          },
          { new: true },
        )
        .exec();
      return result;
    } catch (error) {
      console.error('Error en removeMember del repository:', error);
      throw error;
    }
  }
}
