import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RevokedTokenDocument = RevokedToken & Document;

@Schema({ timestamps: true })
export class RevokedToken {
  @Prop({ required: true, unique: true })
  jti: string; // token id or full token

  @Prop({ required: true })
  exp: number; // expiration timestamp (seconds)
}

export const RevokedTokenSchema = SchemaFactory.createForClass(RevokedToken);
