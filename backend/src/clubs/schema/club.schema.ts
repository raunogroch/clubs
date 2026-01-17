import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Sport } from 'src/sports/schemas/sport.schemas';
import { Group } from '../groups/schema/group.schema';
import { User } from 'src/users/schemas/user.schema';

// Esquema de Club para Mongoose
@Schema({ timestamps: true })
export class Club extends Document {
  /** Imagen de club en base64 */
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

  /** Nombre del club */
  @Prop({ type: String, required: true })
  name: string;

  /** Disciplina deportiva asociada */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  })
  sport: Sport;

  /** Breve referencia del club */
  @Prop({ type: String })
  description: string;

  /** Horario asociado al club */
  /** Monto mensual (en la moneda local) que cobra el club por atleta */
  @Prop({ type: Number, default: 0 })
  monthly_pay: number;

  /** Horario asociado al club */
  /** Grupos asociados al club */
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Group',
    default: [],
  })
  groups: Group[];

  /** Grupo administrativo propietario de este club */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ManagementGroup',
    required: false,
  })
  groupId?: mongoose.Schema.Types.ObjectId;

  /** Asistentes responsables de este club */
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  assistants: User[];

  /** Bandera para soft-delete */
  @Prop({ type: Boolean, default: true })
  active: boolean;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
