/**
 * Schema de Evento
 * Representa un evento personalizado de un grupo
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  /**
   * ID del grupo al que pertenece este evento
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  })
  group_id: Types.ObjectId;

  /**
   * Nombre del evento
   * Requerido
   */
  @Prop({ required: true, maxlength: 100 })
  name: string;

  /**
   * Ubicación del evento
   * Opcional
   */
  @Prop({ maxlength: 200 })
  location?: string;

  /**
   * Duración del evento en minutos
   * Ej: 60 para 1 hora, 90 para 1.5 horas
   */
  @Prop({ required: true, default: 60 })
  duration: number;

  /**
   * Fecha del evento
   * Formato: YYYY-MM-DD
   */
  @Prop({ required: true })
  eventDate: string;

  /**
   * Hora del evento
   * Formato: HH:mm
   */
  @Prop({ required: true })
  eventTime: string;

  /**
   * Si el evento está suspendido
   * Default: false
   */
  @Prop({ default: false })
  suspended: boolean;

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

export const EventSchema = SchemaFactory.createForClass(Event);

/**
 * Índices para mejor performance
 */
EventSchema.index({ group_id: 1 });
EventSchema.index({ group_id: 1, eventDate: 1 });
