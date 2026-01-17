import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Roles } from '../enum/roles.enum';

// Esquema de User para Mongoose
@Schema({ timestamps: true })
export class User extends mongoose.Document {
  /** Rol del usuario (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @Prop({ required: true, enum: Roles })
  role: Roles;

  // ========== CAMPOS COMUNES A MÚLTIPLES ROLES ==========

  /** Nombre de usuario (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @Prop({ required: false, unique: true, sparse: true })
  username?: string;

  /** Contraseña encriptada (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @Prop({ required: false })
  password?: string;

  /** Nombre real del usuario (todos excepto PARENT) */
  @Prop({ required: false })
  name?: string;

  /** Segundo nombre (ATHLETE, PARENT, COACH, ASSISTANT) */
  @Prop({ required: false })
  middle_name?: string;

  /** Apellido del usuario (todos excepto SUPERADMIN/ADMIN) */
  @Prop({ required: false })
  lastname?: string;

  /** Cédula de identidad (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN) */
  @Prop({ required: false })
  ci?: string;

  // ========== CAMPOS ESPECÍFICOS DE ATHLETE ==========

  /** Género del atleta (ATHLETE) */
  @Prop({ required: false })
  gender?: string;

  /** Fecha de nacimiento (ATHLETE) */
  @Prop({ required: false })
  birth_date?: Date;

  // ========== CAMPOS ESPECÍFICOS DE PARENT ==========

  /** Teléfono del padre/tutor (PARENT) */
  @Prop({ required: false })
  phone?: string;

  // ========== CAMPOS OPCIONALES (LEGADO) ==========

  /** Altura en centímetros */
  @Prop({ required: false })
  height?: number;

  /** Peso en kilogramos */
  @Prop({ required: false })
  weight?: number;

  /** Bandera para soft-delete */
  @Prop({ type: Boolean, default: true })
  active: boolean;

  /** Imágenes de perfil en diferentes resoluciones (ATHLETE, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @Prop({
    type: {
      small: { type: String },
      medium: { type: String },
      large: { type: String },
    },
    required: false,
  })
  images?: {
    small: string;
    medium: string;
    large: string;
  };

  /** Array de IDs de asignaciones para admins */
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    default: [],
    required: false,
  })
  assignments?: mongoose.Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User);
