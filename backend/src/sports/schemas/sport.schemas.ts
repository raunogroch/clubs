import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Esquema de Sport para Mongoose
@Schema({ timestamps: true })
export class Sport extends Document {
  /** Nombre del deporte */
  @Prop({ type: String, required: true })
  name: string;

  /** Bandera para soft-delete */
  @Prop({ type: Boolean, default: true })
  active: boolean;
}
export const SportsSchema = SchemaFactory.createForClass(Sport);
