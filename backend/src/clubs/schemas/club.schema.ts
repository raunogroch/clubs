/**
 * Schema de Club
 * Representa un club perteneciente a una asignación
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Club extends Document {
  /**
   * Nombre del club
   */
  @Prop({
    type: String,
    required: false,
  })
  name?: string;

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
  // description removed per request

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
   * Array de IDs de grupos que pertenecen al club
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'Group',
    default: [],
  })
  groups?: Types.ObjectId[];

  /**
   * Array de IDs de eventos agregados al club
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'Event',
    default: [],
  })
  events_added?: Types.ObjectId[];

  /**
   * IDs de los niveles/logros del club
   * Referencias a documentos de ClubLevel
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'ClubLevel',
    default: [],
  })
  levels?: Types.ObjectId[];

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
   * Imágenes/Logo del club en diferentes resoluciones
   */
  @Prop({
    type: {
      small: { type: String },
      medium: { type: String },
      large: { type: String },
    },
    required: false,
  })
  images?: {
    small: string;
    medium: string;
    large: string;
  };

  /**
   * Timestamp de creación (automático) - generado por timestamps: true
   */
  createdAt?: Date;

  /**
   * Timestamp de última actualización (automático) - generado por timestamps: true
   */
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
ClubSchema.index({ events_added: 1 });
