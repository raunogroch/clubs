import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export enum Turn {
  MAÑANA = 'mañana',
  TARDE = 'tarde',
  NOCHE = 'noche',
}

export enum WeekDays {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miércoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sábado',
  DOMINGO = 'domingo',
}

export interface DailySchedule {
  day: WeekDays;
  startTime: string; // Formato HH:MM
  endTime: string; // Formato HH:MM
  active: boolean; // Para desactivar días específicos sin eliminarlos
}
@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string; // Nombre del grupo (ej: "Juveniles A", "Preinfantiles")

  @Prop({
    type: Types.ObjectId,
    ref: 'Club',
    required: true,
    index: true,
  })
  club: Types.ObjectId; // Referencia al club

  @Prop({
    type: String,
    required: true,
    enum: Object.values(Turn),
    index: true,
  })
  turn: Turn;

  @Prop([
    {
      day: {
        type: String,
        enum: Object.values(WeekDays),
        required: true,
      },
      startTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validación formato HH:MM
      },
      endTime: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validación formato HH:MM
      },
      active: {
        type: Boolean,
        default: true,
      },
    },
  ])
  dailySchedules: DailySchedule[];

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  })
  place: string;

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function (coaches: Types.ObjectId[]) {
          return coaches.length > 0; // Debe haber al menos un entrenador
        },
        message: 'El grupo debe tener al menos un entrenador',
      },
    },
  ])
  coaches: Types.ObjectId[];

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ])
  athletes: Types.ObjectId[];

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
