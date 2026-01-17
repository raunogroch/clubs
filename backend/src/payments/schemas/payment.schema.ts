import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  athlete: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true })
  club: mongoose.Types.ObjectId;

  // Monto en la moneda local. Puede venir del club o especificarse en la creación.
  @Prop({ type: Number, required: true })
  amount: number;

  /** Mes al que se refiere el pago (por ejemplo "2025-10") */
  @Prop({ type: String })
  month?: string;

  /** Nota o justificativo cuando el monto difiere del mensual */
  @Prop({ type: String })
  note?: string;

  /** Grupo administrativo propietario de este pago */
  @Prop({
    type: Types.ObjectId,
    ref: 'ManagementGroup',
    required: false,
  })
  groupId?: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Índice compuesto único para evitar duplicados athlete+club+month cuando month existe
PaymentSchema.index(
  { athlete: 1, club: 1, month: 1 },
  { unique: true, partialFilterExpression: { month: { $exists: true } } },
);
