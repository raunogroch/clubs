import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Sport extends Document {
  @Prop({ type: String, required: true })
  name: string;
}
export const SportsSchema = SchemaFactory.createForClass(Sport);
