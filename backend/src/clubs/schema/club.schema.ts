import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Schedule } from 'src/schedules/schema/schedule.schema';
import { Sport } from 'src/sports/schemas/sport.schemas';
import { User } from 'src/users/schemas/user.schema';

// Esquema de Club para Mongoose
@Schema({ timestamps: true })
export class Club extends Document {
  /** Nombre del club */
  @Prop({ type: String, required: true })
  name: string;

  /** Lugar donde se ubica el club */
  @Prop({ type: String, required: true })
  place: string;

  /** Disciplina deportiva asociada */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  })
  discipline: Sport;

  /** Horario asociado al club */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  })
  schedule: Schedule;

  /** Lista de entrenadores */
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  coaches: User[];

  /** Lista de atletas */
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  athletes: User[];
}

export const ClubSchema = SchemaFactory.createForClass(Club);
