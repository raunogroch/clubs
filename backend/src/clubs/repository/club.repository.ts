/**
 * Repository para Club
 * Gestiona operaciones CRUD en la base de datos
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Club } from '../schemas/club.schema';
import { CreateClubDto } from '../dto/create-club.dto';
import { UpdateClubDto } from '../dto/update-club.dto';

@Injectable()
export class ClubRepository {
  constructor(@InjectModel(Club.name) private clubModel: Model<Club>) {}

  /**
   * Crear un nuevo club
   */
  async create(createClubDto: CreateClubDto, userId: string): Promise<Club> {
    const club = new this.clubModel({
      ...createClubDto,
      assignment_id: new Types.ObjectId(createClubDto.assignment_id),
      created_by: new Types.ObjectId(userId),
    });

    return club.save();
  }

  /**
   * Añadir un grupo al campo `groups` del club
   */
  async addGroupToClub(clubId: string, groupId: string): Promise<void> {
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $addToSet: { groups: new Types.ObjectId(groupId) } },
    );
  }

  /**
   * Remover un grupo del campo `groups` del club
   */
  async removeGroupFromClub(clubId: string, groupId: string): Promise<void> {
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $pull: { groups: new Types.ObjectId(groupId) } },
    );
  }

  /**
   * Obtener todos los clubs de una asignación
   */
  async findByAssignment(assignmentId: string): Promise<Club[]> {
    return this.clubModel
      .find({
        assignment_id: new Types.ObjectId(assignmentId),
      })
      .populate('created_by', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener clubs de una asignación con sport populado
   */
  async findByAssignmentWithPopulate(assignmentId: string): Promise<Club[]> {
    return this.clubModel
      .find({
        assignment_id: new Types.ObjectId(assignmentId),
      })
      .populate('sport_id', 'name')
      .populate('created_by', 'name')
      .populate('groups')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener un club por ID
   */
  async findById(clubId: string): Promise<Club | null> {
    return this.clubModel
      .findById(clubId)
      .populate('created_by', 'name')
      .populate('assignment_id', 'module_name')
      .exec();
  }

  /**
   * Actualizar un club
   */
  async update(
    clubId: string,
    updateClubDto: UpdateClubDto,
  ): Promise<Club | null> {
    try {
      return await this.clubModel.findByIdAndUpdate(clubId, updateClubDto, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      console.error('Error en update del repository:', error);
      throw error;
    }
  }

  /**
   * Eliminar un club
   */
  async delete(clubId: string): Promise<Club | null> {
    try {
      return await this.clubModel.findByIdAndDelete(clubId, { new: true });
    } catch (error) {
      console.error('Error en delete del repository:', error);
      throw error;
    }
  }

  /**
   * Verificar si un club pertenece a una asignación
   */
  async belongsToAssignment(
    clubId: string,
    assignmentId: string,
  ): Promise<boolean> {
    const club = await this.clubModel.findOne({
      _id: new Types.ObjectId(clubId),
      assignment_id: new Types.ObjectId(assignmentId),
    });

    return !!club;
  }

  /**
   * Obtener clubs creados por un usuario
   */
  async findByCreator(userId: string): Promise<Club[]> {
    return this.clubModel
      .find({
        created_by: new Types.ObjectId(userId),
      })
      .populate('assignment_id', 'module_name')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Contar clubs en una asignación
   */
  async countByAssignment(assignmentId: string): Promise<number> {
    return this.clubModel.countDocuments({
      assignment_id: new Types.ObjectId(assignmentId),
    });
  }

  /**
   * Añadir un nivel embebido en el club
   */
  async addLevel(
    clubId: string,
    level: { position: number; name: string; description?: string },
  ): Promise<Club | null> {
    const levelDoc = {
      _id: new Types.ObjectId(),
      position: level.position,
      name: level.name,
      description: level.description,
    } as any;

    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $push: { levels: levelDoc } },
    );

    return this.findById(clubId);
  }

  /**
   * Actualizar un nivel embebido en el club
   */
  async updateLevel(
    clubId: string,
    levelId: string,
    level: { position?: number; name?: string; description?: string },
  ): Promise<Club | null> {
    const update: any = {};
    if (level.position !== undefined)
      update['levels.$.position'] = level.position;
    if (level.name !== undefined) update['levels.$.name'] = level.name;
    if (level.description !== undefined)
      update['levels.$.description'] = level.description;

    await this.clubModel.updateOne(
      {
        _id: new Types.ObjectId(clubId),
        'levels._id': new Types.ObjectId(levelId),
      },
      { $set: update },
    );

    return this.findById(clubId);
  }

  /**
   * Eliminar un nivel embebido del club
   */
  async deleteLevel(clubId: string, levelId: string): Promise<Club | null> {
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $pull: { levels: { _id: new Types.ObjectId(levelId) } } },
    );

    return this.findById(clubId);
  }
}
