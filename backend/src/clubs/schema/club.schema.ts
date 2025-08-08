import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Club extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    required: true,
  })
  schedule: {
    startTime: string;
    endTime: string;
  };

  @Prop({ type: String, required: true })
  place: string;

  @Prop({ type: String, required: true })
  discipline: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  coaches: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  athletes: User[];
}

export const ClubSchema = SchemaFactory.createForClass(Club);
