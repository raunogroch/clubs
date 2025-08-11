import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { Sport } from 'src/sports/schemas/sport.schemas';
import { Competitor, CompetitorSchema } from './competitor.schema';

@Schema({ timestamps: true })
export class Competency extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  })
  discipline: Sport;

  @Prop({ type: Date, required: true })
  dateEvent: Date;

  @Prop({ type: String, required: true })
  place: string;

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
