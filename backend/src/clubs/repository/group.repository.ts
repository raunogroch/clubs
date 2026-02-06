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
import {
  CreateGroupLevelDto,
  UpdateGroupLevelDto,
} from '../dto/group-level.dto';

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
      .populate({
        path: 'athletes_added',
        select: 'athlete_id registration_pay registration_date',
        populate: { path: 'athlete_id', select: 'name role ci lastname' },
      })
      .populate('coaches', 'name role ci lastname')
      .populate(
        'events_added',
        'name location duration eventDate eventTime suspended createdAt updatedAt',
      )
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Obtener un grupo por ID
   */
  async findById(
    groupId: string,
    projection?: string[],
  ): Promise<Group | null> {
    const query = this.groupModel.findById(groupId);

    // If a projection is provided, use .select to limit fields
    if (projection && projection.length > 0) {
      // Always include relational field refs so populate() can work
      const fieldsToSelect = new Set([...projection, 'club_id']);
      if (projection.some((f) => f.includes('athletes_added'))) {
        fieldsToSelect.add('athletes_added');
      }
      if (projection.some((f) => f.includes('coaches'))) {
        fieldsToSelect.add('coaches');
      }
      // Note: 'athletes' field doesn't exist in schema, only 'athletes_added'
      if (
        projection.some(
          (f) =>
            f.includes('events_added') ||
            f.includes('events') ||
            f.includes('schedule'),
        )
      ) {
        fieldsToSelect.add('events_added');
        fieldsToSelect.add('schedule');
      }
      if (projection.some((f) => f.includes('created'))) {
        fieldsToSelect.add('created_by');
      }

      query.select(Array.from(fieldsToSelect).join(' '));

      // Conditionally populate only requested relational fields
      if (projection.includes('athletes_added')) {
        query.populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: {
            path: 'athlete_id',
            select: 'name role ci lastname images',
          },
        });
      }

      if (projection.includes('coaches')) {
        query.populate('coaches', 'name role ci lastname images');
      }

      if (projection.includes('club_id')) {
        query.populate('club_id', 'name');
      }

      if (
        projection.includes('events_added') ||
        projection.includes('events')
      ) {
        query.populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        );
      }

      if (projection.includes('created_by')) {
        query.populate('created_by', 'name');
      }

      return query.exec();
    }

    // Default behaviour: full object with usual populates
    return this.groupModel
      .findById(groupId)
      .populate('created_by', 'name')
      .populate({
        path: 'athletes_added',
        select: 'athlete_id registration_pay registration_date',
        populate: { path: 'athlete_id', select: 'name role ci lastname' },
      })
      .populate('coaches', 'name role ci lastname')
      .populate('club_id', 'name')
      .populate(
        'events_added',
        'name location duration eventDate eventTime suspended createdAt updatedAt',
      )
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
      return await this.groupModel
        .findByIdAndUpdate(groupId, updateGroupDto, {
          new: true,
          runValidators: true,
        })
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
        .exec();
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
          { $addToSet: { athletes_added: new Types.ObjectId(athleteId) } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
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
          { $pull: { athletes_added: new Types.ObjectId(athleteId) } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
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
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
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
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
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
              athletes_added: new Types.ObjectId(memberId),
              coaches: new Types.ObjectId(memberId),
            },
          },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
        .exec();
      return result;
    } catch (error) {
      console.error('Error en removeMember del repository:', error);
      throw error;
    }
  }

  /**
   * Obtener grupos donde un usuario es coach
   */
  async findByCoach(coachId: string): Promise<Group[]> {
    return this.groupModel
      .find({
        coaches: new Types.ObjectId(coachId),
      })
      .select('name club_id schedule events_added')
      .populate('club_id', 'name')
      .populate(
        'events_added',
        'name location duration eventDate eventTime suspended createdAt updatedAt',
      )
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Agregar horario a un grupo
   */
  async addSchedule(
    groupId: string,
    schedule: { day: string; startTime: string; endTime: string },
  ): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(
          groupId,
          { $push: { schedule: schedule } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
        .exec();
    } catch (error) {
      console.error('Error en addSchedule del repository:', error);
      throw error;
    }
  }

  /**
   * Remover horario de un grupo
   */
  async removeSchedule(
    groupId: string,
    scheduleIndex: number,
  ): Promise<Group | null> {
    try {
      // Primero obtenemos el grupo
      const group = await this.groupModel.findById(groupId).exec();
      if (!group) return null;

      // Removemos el horario por índice
      if (group.schedule && group.schedule.length > scheduleIndex) {
        group.schedule.splice(scheduleIndex, 1);
        return group.save().then(() =>
          this.groupModel
            .findById(groupId)
            .populate('created_by', 'name')
            .populate({
              path: 'athletes_added',
              populate: { path: 'athlete_id', select: 'name role ci lastname' },
            })
            .populate('coaches', 'name role ci lastname')
            .populate('club_id', 'name')
            .populate(
              'events_added',
              'name location duration eventDate eventTime suspended createdAt updatedAt',
            )
            .exec(),
        );
      }

      return group;
    } catch (error) {
      console.error('Error en removeSchedule del repository:', error);
      throw error;
    }
  }

  /**
   * Añadir un nivel al grupo
   */
  async addLevel(
    groupId: string,
    level: {
      _id: Types.ObjectId;
      position: number;
      name: string;
      description?: string;
    },
  ): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(groupId, { $push: { levels: level } }, { new: true })
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
        .exec();
    } catch (error) {
      console.error('Error en addLevel del repository:', error);
      throw error;
    }
  }

  /**
   * Actualizar un nivel del grupo
   */
  async updateLevel(
    groupId: string,
    levelId: string,
    updateLevelDto: UpdateGroupLevelDto,
  ): Promise<Group | null> {
    try {
      const updateObj: any = {};
      if (updateLevelDto.position !== undefined) {
        updateObj['levels.$.position'] = updateLevelDto.position;
      }
      if (updateLevelDto.name !== undefined) {
        updateObj['levels.$.name'] = updateLevelDto.name;
      }
      if (updateLevelDto.description !== undefined) {
        updateObj['levels.$.description'] = updateLevelDto.description;
      }

      return await this.groupModel
        .findOneAndUpdate(
          { _id: groupId, 'levels._id': new Types.ObjectId(levelId) },
          { $set: updateObj },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate(
          'events_added',
          'name location duration eventDate eventTime suspended createdAt updatedAt',
        )
        .exec();
    } catch (error) {
      console.error('Error en updateLevel del repository:', error);
      throw error;
    }
  }

  /**
   * Eliminar un nivel del grupo
   */
  async deleteLevel(groupId: string, levelId: string): Promise<Group | null> {
    try {
      return await this.groupModel
        .findByIdAndUpdate(
          groupId,
          { $pull: { levels: { _id: new Types.ObjectId(levelId) } } },
          { new: true },
        )
        .populate('created_by', 'name')
        .populate({
          path: 'athletes_added',
          select: 'athlete_id registration_pay registration_date',
          populate: { path: 'athlete_id', select: 'name role ci lastname' },
        })
        .populate('coaches', 'name role ci lastname')
        .populate('club_id', 'name')
        .populate('events_added', 'name location duration eventDate eventTime')
        .exec();
    } catch (error) {
      console.error('Error en deleteLevel del repository:', error);
      throw error;
    }
  }
}
