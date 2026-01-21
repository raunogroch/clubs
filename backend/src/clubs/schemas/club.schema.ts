/**
 * Schema de Club
 * Representa un club perteneciente a una asignación
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Club extends Document {
  /**
   * Deporte asociado al club
   * Referencia al documento de Sport
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Sport',
    required: true,
  })
  sport_id: Types.ObjectId;

  /**
   * Descripción del club
   */
  @Prop()
  description?: string;

  /**
   * Ubicación/lugar del club
   */
  @Prop()
  location?: string;

  /**
   * ID de la asignación a la que pertenece este club
   * Cada club pertenece únicamente a una asignación
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Assignment',
    required: true,
  })
  assignment_id: Types.ObjectId;

  /**
   * ID del administrador que creó el club
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  created_by: Types.ObjectId;

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

export const ClubSchema = SchemaFactory.createForClass(Club);

/**
 * Índices para mejor performance
 */
ClubSchema.index({ assignment_id: 1, sport_id: 1 }, { unique: true });
ClubSchema.index({ assignment_id: 1 });
ClubSchema.index({ created_by: 1 });
ClubSchema.index({ sport_id: 1 });
ClubSchema.index({ assignment_id: 1 });
ClubSchema.index({ created_by: 1 });
