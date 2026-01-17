import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from '../schemas/assignment.schema';

/**
 * Interfaz del repositorio de asignaciones
 * Define los métodos para acceder a los datos
 */
export interface IAssignmentRepository {
  create(data: any): Promise<Assignment>;
  findAll(filters?: any): Promise<Assignment[]>;
  findById(id: string): Promise<Assignment | null>;
  findByModuleName(moduleName: string): Promise<Assignment | null>;
  update(id: string, data: any): Promise<Assignment | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Repositorio de asignaciones
 * Implementa los métodos CRUD para la colección de asignaciones
 */
@Injectable()
export class AssignmentRepository implements IAssignmentRepository {
  constructor(
    @InjectModel(Assignment.name)
    private readonly assignmentModel: Model<Assignment>,
  ) {}

  /**
   * Crear una nueva asignación
   * @param data Datos de la asignación
   * @returns Asignación creada
   */
  async create(data: any): Promise<Assignment> {
    const assignment = new this.assignmentModel(data);
    return assignment.save();
  }

  /**
   * Obtener todas las asignaciones con filtros opcionales
   * @param filters Filtros a aplicar
   * @returns Array de asignaciones
   */
  async findAll(filters: any = {}): Promise<Assignment[]> {
    return this.assignmentModel
      .find(filters)
      .populate('assigned_admins assigned_by')
      .exec();
  }

  /**
   * Obtener asignación por ID
   * @param id ID de la asignación
   * @returns Asignación o null
   */
  async findById(id: string): Promise<Assignment | null> {
    return this.assignmentModel
      .findById(id)
      .populate('assigned_admins assigned_by')
      .exec();
  }

  /**
   * Obtener asignación por nombre del módulo
   * @param moduleName Nombre del módulo
   * @returns Asignación o null
   */
  async findByModuleName(moduleName: string): Promise<Assignment | null> {
    return this.assignmentModel
      .findOne({ module_name: moduleName })
      .populate('assigned_admins assigned_by')
      .exec();
  }

  /**
   * Actualizar asignación por ID
   * @param id ID de la asignación
   * @param data Datos a actualizar
   * @returns Asignación actualizada o null
   */
  async update(id: string, data: any): Promise<Assignment | null> {
    return this.assignmentModel
      .findByIdAndUpdate(id, { ...data, updated_at: new Date() }, { new: true })
      .populate('assigned_admins assigned_by')
      .exec();
  }

  /**
   * Eliminar asignación por ID
   * @param id ID de la asignación
   * @returns true si se eliminó, false si no existe
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.assignmentModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
