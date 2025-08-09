import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Schedule extends Document {
  @Prop({ type: String, required: true })
  startTime: { type: String; required: true };
  @Prop({ type: String, required: true })
  endTime: { type: String; required: true };
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
