import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Schedule } from 'src/schedules/schema/schedule.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Club extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  place: string;

  @Prop({ type: String, required: true })
  discipline: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }] })
  schedule: Schedule;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  coaches: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  athletes: User[];
}

export const ClubSchema = SchemaFactory.createForClass(Club);
