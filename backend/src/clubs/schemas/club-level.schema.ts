/**
 * Schema para Niveles/Logros del Club
 * Documentos separados que son referenciados por los clubs
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ClubLevel extends Document {
  /**
   * Club al que pertenece este nivel
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Club',
    required: true,
  })
  club_id: Types.ObjectId;

  /**
   * Posición/orden del nivel en el club
   */
  @Prop({ required: true })
  position: number;

  /**
   * Nombre del nivel
   */
  @Prop({ required: true })
  name: string;

  /**
   * Descripción del nivel
   */
  @Prop()
  description?: string;

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

export const ClubLevelSchema = SchemaFactory.createForClass(ClubLevel);

// Índice para encontrar rápidamente niveles por club
ClubLevelSchema.index({ club_id: 1, position: 1 });
