import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum Turn {
  MAÑANA = 'mañana',
  TARDE = 'tarde',
  NOCHE = 'noche',
}

export enum WeekDays {
  LUNES = 'Lunes',
  MARTES = 'Martes',
  MIERCOLES = 'Miércoles',
  JUEVES = 'Jueves',
  VIERNES = 'Viernes',
  SABADO = 'Sábado',
  DOMINGO = 'Domingo',
}

export class DailySchedule {
  @Prop({ type: String, enum: Object.values(WeekDays), required: true })
  day: WeekDays | '';

  @Prop({ type: String, enum: Object.values(Turn), required: true })
  turn: Turn | '';

  @Prop({
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  startTime: string;

  @Prop({
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  })
  endTime: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;
}

@Schema({ timestamps: true })
export class ManagementGroup extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: false })
  sport?: string;

  @Prop({ type: String, required: false })
  category?: string;

  @Prop({ type: [DailySchedule], required: false, default: [] })
  schedule?: DailySchedule[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  coaches?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  athletes?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  administrator?: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Club', default: [] })
  clubs?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Sport', default: [] })
  sports?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], default: [] })
  subscriptions?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy?: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;
}

export const ManagementGroupSchema =
  SchemaFactory.createForClass(ManagementGroup);
