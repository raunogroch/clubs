/**
 * Repository para Club
 * Gestiona operaciones CRUD en la base de datos
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Club } from '../schemas/club.schema';
import { ClubLevel } from '../schemas/club-level.schema';
import { CreateClubDto } from '../dto/create-club.dto';
import { UpdateClubDto } from '../dto/update-club.dto';

@Injectable()
export class ClubRepository {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<Club>,
    @InjectModel(ClubLevel.name) private clubLevelModel: Model<ClubLevel>,
  ) {}

  /**
   * Verificar si ya existe un club con la misma combinación de assignment_id y sport_id
   */
  async existsBySportAndAssignment(
    sport_id: string,
    assignment_id: string,
  ): Promise<boolean> {
    const count = await this.clubModel.countDocuments({
      sport_id: new Types.ObjectId(sport_id),
      assignment_id: new Types.ObjectId(assignment_id),
    });
    return count > 0;
  }

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
      .sort({ createdAt: -1 });
  }

  /**
   * Obtener todos los clubes cuyas asignaciones estén en la lista dada.
   * Esto evita ejecutar múltiples consultas paralelas cuando el usuario tiene
   * varias asignaciones y mejora significativamente el rendimiento.
   */
  async findByAssignments(assignmentIds: string[]): Promise<Club[]> {
    if (!assignmentIds || assignmentIds.length === 0) return [];
    const objectIds = assignmentIds.map((id) => new Types.ObjectId(id));
    return this.clubModel
      .find({ assignment_id: { $in: objectIds } })
      .populate('created_by', 'name')
      .sort({ createdAt: -1 });
  }

  /**
   * Obtener clubs de una asignación con sport y levels populados
   */
  async findByAssignmentWithPopulate(assignmentId: string): Promise<Club[]> {
    return this.clubModel
      .find({
        assignment_id: new Types.ObjectId(assignmentId),
      })
      .populate('sport_id')
      .populate('created_by', 'name')
      .populate('groups')
      .populate('levels', 'position name description')
      .sort({ createdAt: -1 });
  }

  /**
   * Obtener un club por ID
   */
  async findById(clubId: string): Promise<Club | null> {
    return this.clubModel
      .findById(clubId)
      .populate('sport_id')
      .populate('created_by', 'name')
      .populate('assignment_id', 'module_name')
      .populate('groups')
      .populate('levels', 'position name description');
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
      .sort({ createdAt: -1 });
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
   * Añadir un asistente al club (agrega su ID al arreglo assistants_added)
   */
  async addAssistantToClub(clubId: string, assistantId: string): Promise<void> {
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $addToSet: { assistants_added: new Types.ObjectId(assistantId) } },
    );
  }

  /**
   * Remover un asistente del club
   */
  async removeAssistantFromClub(
    clubId: string,
    assistantId: string,
  ): Promise<void> {
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $pull: { assistants_added: new Types.ObjectId(assistantId) } },
    );
  }

  /**
   * Buscar clubs pertenecientes a una o varias asignaciones que tengan
   * asistentes registrados. El arreglo `assistants_added` se mantiene tal cual,
   * y la llamada de servicio podrá hacer `populate` si lo requiere.
   */
  async findByAssignmentsWithAssistants(
    assignmentIds: string[],
  ): Promise<Club[]> {
    if (!assignmentIds || assignmentIds.length === 0) return [];
    const objectIds = assignmentIds.map((id) => new Types.ObjectId(id));
    return (
      this.clubModel
        .find({
          assignment_id: { $in: objectIds },
          assistants_added: { $exists: true, $ne: [] },
        })
        // traer algunos campos del usuario para facilitar el mapeo posterior
        .populate('assistants_added', 'name lastname username')
        .exec()
    );
  }

  /**
   * Obtener clubs a los que fue agregado un asistente específico
   */
  async findByAssistant(assistantId: string): Promise<Club[]> {
    return this.clubModel
      .find({ assistants_added: new Types.ObjectId(assistantId) })
      .populate('assignment_id', 'module_name');
  }

  /**
   * Añadir un nivel al club (crea documento separado de ClubLevel)
   */
  async addLevel(
    clubId: string,
    level: { position: number; name: string; description?: string },
  ): Promise<Club | null> {
    // Crear el nivel en la colección ClubLevel
    const newLevel = new this.clubLevelModel({
      club_id: new Types.ObjectId(clubId),
      position: level.position,
      name: level.name,
      description: level.description,
    });

    const savedLevel = await newLevel.save();

    // Agregar el ID del nivel al club
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $addToSet: { levels: savedLevel._id } },
    );

    return this.findById(clubId);
  }

  /**
   * Actualizar un nivel del club
   */
  async updateLevel(
    clubId: string,
    levelId: string,
    level: { position?: number; name?: string; description?: string },
  ): Promise<Club | null> {
    // Actualizar el documento de ClubLevel
    const updateData: any = {};
    if (level.position !== undefined) updateData.position = level.position;
    if (level.name !== undefined) updateData.name = level.name;
    if (level.description !== undefined)
      updateData.description = level.description;

    await this.clubLevelModel.findByIdAndUpdate(
      new Types.ObjectId(levelId),
      updateData,
      { new: true },
    );

    return this.findById(clubId);
  }

  /**
   * Eliminar un nivel del club
   */
  async deleteLevel(clubId: string, levelId: string): Promise<Club | null> {
    // Eliminar el documento de ClubLevel
    await this.clubLevelModel.findByIdAndDelete(new Types.ObjectId(levelId));

    // Remover el ID del nivel del club
    await this.clubModel.updateOne(
      { _id: new Types.ObjectId(clubId) },
      { $pull: { levels: new Types.ObjectId(levelId) } },
    );

    return this.findById(clubId);
  }
}
