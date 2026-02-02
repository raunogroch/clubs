import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  athlete_id: Types.ObjectId;

  @Prop()
  payment_date?: Date;

  @Prop()
  payment_start?: Date;

  @Prop()
  payment_end?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ athlete_id: 1 });
PaymentSchema.index({ group_id: 1 });
