import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

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
export class Group extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true,
  })
  clubId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  })
  name: string;

  @Prop({ type: [DailySchedule], required: true })
  dailySchedules: DailySchedule[];

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  })
  place: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  coaches: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    required: true,
  })
  athletes: Types.ObjectId[];

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
