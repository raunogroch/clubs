import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Registration extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group_id: Types.ObjectId;

  /**
   * Assignment al que pertenece esta inscripción
   */
  @Prop({ type: Types.ObjectId, ref: 'Assignment' })
  assignment_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  athlete_id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  registration_date: Date;

  @Prop({ type: Date, default: null })
  registration_pay?: Date | null;

  @Prop({ type: Number, default: null })
  registration_amount?: number | null;

  @Prop({ type: [Types.ObjectId], ref: 'Payment', default: [] })
  monthly_payments?: Types.ObjectId[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);

RegistrationSchema.index({ group_id: 1 });
RegistrationSchema.index({ athlete_id: 1 });
RegistrationSchema.index({ assignment_id: 1 });
