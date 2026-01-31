/**
 * Schema de Grupo
 * Representa un grupo perteneciente a un club
 * Los grupos son subdivisiones dentro de un club
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Interfaz para horarios
 */
export interface Schedule {
  day: string; // Día de la semana (Monday, Tuesday, etc.)
  startTime: string; // Hora de inicio (HH:mm)
  endTime: string; // Hora de fin (HH:mm)
}

@Schema({ timestamps: true })
export class Group extends Document {
  /**
   * Nombre del grupo
   * Requerido, único dentro del club
   */
  @Prop({ required: true })
  name: string;

  /**
   * Descripción del grupo
   */
  @Prop()
  description?: string;

  /**
   * ID del club al que pertenece este grupo
   * Cada grupo pertenece únicamente a un club
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Club',
    required: true,
  })
  club_id: Types.ObjectId;

  /**
   * ID del administrador que creó el grupo
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  created_by: Types.ObjectId;

  /**
   * Array de atletas del grupo
   * Contiene IDs de registros (registrations) creados para los atletas
   * Cada elemento hace referencia al documento del módulo `Registration`
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'Registration',
    default: [],
  })
  athletes_added: Types.ObjectId[];

  /**
   * Array de entrenadores del grupo
   * Contiene IDs de usuarios con rol 'coach'
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  coaches: Types.ObjectId[];

  /**
   * Precio/Mensualidad del grupo
   * Costo de la inscripción mensual en Bs. (Bolivianos)
   */
  @Prop({
    type: Number,
    default: 0,
  })
  monthly_fee?: number;

  /**
   * Array de horarios del grupo
   * Cada horario contiene día de la semana y rango de horas
   */
  @Prop({
    type: [
      {
        day: String, // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
        startTime: String, // HH:mm format
        endTime: String, // HH:mm format
      },
    ],
    default: [],
  })
  schedule?: Schedule[];

  /**
   * Timestamp de creación (automático)
   */
  @Prop()
  createdAt?: Date;

  /**
   * Timestamp de última actualización (automático)
   */
  @Prop()
  updatedAt?: Date;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

/**
 * Índices para mejor performance
 */
GroupSchema.index({ club_id: 1, name: 1 }, { unique: true });
GroupSchema.index({ club_id: 1 });
GroupSchema.index({ created_by: 1 });
