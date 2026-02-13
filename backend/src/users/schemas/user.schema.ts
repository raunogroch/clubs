import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Roles } from '../enum/roles.enum';

// Esquema de User para Mongoose
@Schema({ timestamps: true })
export class User extends mongoose.Document {
  /** Rol del usuario (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN, SUPERADMIN) - Deprecated: usar roles[] */
  @Prop({ required: false, enum: Roles })
  role?: Roles;

  /** Array de roles del usuario (para soportar múltiples roles) */
  @Prop({
    type: [String],
    enum: Object.values(Roles),
    required: false,
    default: [],
  })
  roles?: Roles[];

  // ========== CAMPOS COMUNES A MÚLTIPLES ROLES ==========

  /** Nombre de usuario (COACH, ASSISTANT, ADMIN, SUPERADMIN - NO ATHLETE ni PARENT) */
  @Prop({ required: false, unique: true, sparse: true })
  username?: string;

  /** Contraseña encriptada (COACH, ASSISTANT, ADMIN, SUPERADMIN - NO ATHLETE ni PARENT) */
  @Prop({ required: false })
  password?: string;

  /** Nombre real del usuario (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN, SUPERADMIN) */
  @Prop({ required: false })
  name?: string;
  /** Apellido del usuario (todos excepto SUPERADMIN/ADMIN) */
  @Prop({ required: false })
  lastname?: string;

  /** Carnet de identidad (ATHLETE, PARENT, COACH, ASSISTANT, ADMIN) */
  @Prop({ required: false })
  ci?: string;

  // ========== CAMPOS ESPECÍFICOS DE ATHLETE ==========

  /** Género del atleta (ATHLETE) */
  @Prop({ required: false })
  gender?: string;

  /** Fecha de nacimiento (ATHLETE) */
  @Prop({ required: false })
  birth_date?: Date;

  /** ID del padre/tutor (ATHLETE) */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  parent_id?: mongoose.Types.ObjectId;

  // ========== CAMPOS ESPECÍFICOS DE PARENT ==========

  /** Teléfono del padre/tutor (PARENT) */
  @Prop({ required: false })
  phone?: string;

  // ========== CAMPOS OPCIONALES (LEGADO) ==========

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

  /** ID de asignación del administrador (SOLO PARA ADMIN) */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: false,
    validate: {
      validator: function (value: any) {
        // Solo permite assignment_id si el rol es ADMIN
        if (value && this.role !== Roles.ADMIN) {
          return false;
        }
        return true;
      },
      message: 'Solo los ADMIN pueden tener una asignación',
    },
  })
  assignment_id?: mongoose.Types.ObjectId;

  // ========== CAMPOS PARA DOCUMENTOS ==========

  /** ID único para identificar archivos en image-processor (ATHLETE) */
  @Prop({ required: false, unique: true, sparse: true })
  fileIdentifier?: string;

  /** Ruta del documento CI en image-processor (ATHLETE) */
  @Prop({ required: false })
  documentPath?: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

// note: inscriptionDate removed from schema — backend will use createdAt
