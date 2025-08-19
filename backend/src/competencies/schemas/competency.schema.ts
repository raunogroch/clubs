import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { Sport } from 'src/sports/schemas/sport.schemas';
import { Competitor, CompetitorSchema } from './competitor.schema';

// Esquema de Competency para Mongoose
@Schema({ timestamps: true })
export class Competency extends Document {
  /** Nombre de la competencia */
  @Prop({ type: String, required: true })
  name: string;

  /** Descripción de la competencia */
  @Prop({ type: String })
  description: string;

  /** Disciplina deportiva asociada */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  })
  discipline: Sport;

  /** Fecha del evento */
  @Prop({ type: Date, required: true })
  dateEvent: Date;

  /** Lugar donde se realiza la competencia */
  @Prop({ type: String, required: true })
  place: string;

  /** Asistentes: entrenadores y competidores */
  @Prop({
    type: {
      coaches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      competitors: [CompetitorSchema],
    },
    default: { coaches: [], competitors: [] },
  })
  attendees: {
    coaches: mongoose.Types.ObjectId[];
    competitors: Competitor[];
  };
}

export const CompetencySchema = SchemaFactory.createForClass(Competency);
