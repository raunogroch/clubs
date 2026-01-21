/**
 * Schema de Grupo
 * Representa un grupo perteneciente a un club
 * Los grupos son subdivisiones dentro de un club
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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
   * Miembros del grupo
   * Array de IDs de usuarios que son miembros
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  members: Types.ObjectId[];

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
