import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Group } from 'src/groups/entities/group.entity';
import { Sport } from 'src/sports/schemas/sport.schemas';

// Esquema de Club para Mongoose
@Schema({ timestamps: true })
export class Club extends Document {
  /** Imagen de club en base64 */
  @Prop()
  image: string;

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
  discription: string;

  /** Horario asociado al club */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  })
  group: Group;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
