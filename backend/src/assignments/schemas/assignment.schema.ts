import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

/**
 * Esquema de Assignment para Mongoose
 * Representa la asignación de administradores a módulos
 */
@Schema({ timestamps: true })
export class Assignment extends mongoose.Document {
  /** ID del módulo asignado */
  @Prop({ required: true })
  module_name: string;

  /** Array de IDs de administradores asignados al módulo (puede estar vacío inicialmente) */
  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
  assigned_admins: mongoose.Types.ObjectId[];

  /** Array de IDs de clubs pertenecientes a este assignment */
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Club', default: [] })
  clubs: mongoose.Types.ObjectId[];

  /** ID del superadmin que realizó la asignación */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  assigned_by: mongoose.Types.ObjectId;

  /** Fecha de creación (automática) */
  @Prop({ default: Date.now })
  created_at: Date;

  /** Fecha de última actualización (automática) */
  @Prop({ default: Date.now })
  updated_at: Date;

  /** Estado activo/inactivo */
  @Prop({ required: true, default: true })
  is_active: boolean;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
