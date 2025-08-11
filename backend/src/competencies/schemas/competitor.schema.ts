import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export enum MedalType {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  NONE = 'none',
}

@Schema({ _id: false })
export class Competitor {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  athlete: User;

  @Prop({ type: Number, required: true })
  position: number;

  @Prop({
    type: String,
    enum: Object.values(MedalType),
    default: MedalType.NONE,
  })
  medal: MedalType;
}

export const CompetitorSchema = SchemaFactory.createForClass(Competitor);
