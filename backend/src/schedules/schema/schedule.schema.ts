import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Esquema de Schedule para Mongoose
@Schema({ timestamps: true })
export class Schedule extends Document {
  /** Hora de inicio del horario */
  @Prop({ type: String, required: true })
  startTime: { type: String; required: true };
  /** Hora de fin del horario */
  @Prop({ type: String, required: true })
  endTime: { type: String; required: true };
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
