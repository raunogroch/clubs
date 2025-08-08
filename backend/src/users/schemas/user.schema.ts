import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User extends mongoose.Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  roles: string[];

  @Prop()
  name: string;

  @Prop()
  lastname: string;

  @Prop()
  email: string;

  @Prop()
  ci: string;

  @Prop()
  birth_date: Date;

  @Prop()
  height: number;

  @Prop()
  weight: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
