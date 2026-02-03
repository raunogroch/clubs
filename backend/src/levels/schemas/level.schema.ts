import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: true })
export class LevelAssignment {
  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const LevelAssignmentSchema =
  SchemaFactory.createForClass(LevelAssignment);

@Schema({ timestamps: true })
export class Level extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
    unique: true,
  })
  group_id: Types.ObjectId;

  @Prop({
    type: [LevelAssignmentSchema],
    default: [],
  })
  level_assignment: LevelAssignment[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LevelSchema = SchemaFactory.createForClass(Level);

// Índice único para asegurar un nivel por grupo
LevelSchema.index({ group_id: 1 }, { unique: true });
