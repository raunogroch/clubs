/**
 * Schema de Schedule
 * Representa un horario de entrenamiento para un grupo
 * Los horarios son documentos independientes referenciados por los grupos
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Interfaz para datos de horario
 */
export interface ScheduleData {
  day: string; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

@Schema({ timestamps: true })
export class Schedule extends Document {
  /**
   * Grupo al que pertenece este horario
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group_id: Types.ObjectId;

  /**
   * Día de la semana
   */
  @Prop({ required: true })
  day: string;

  /**
   * Hora de inicio (HH:mm)
   */
  @Prop({ required: true })
  startTime: string;

  /**
   * Hora de fin (HH:mm)
   */
  @Prop({ required: true })
  endTime: string;

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

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

/**
 * Índices para mejor performance
 */
ScheduleSchema.index({ group_id: 1, day: 1 });
ScheduleSchema.index({ group_id: 1 });
