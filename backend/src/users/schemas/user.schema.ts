import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Roles } from '../enum/roles.enum';

// Esquema de User para Mongoose
@Schema({ timestamps: true })
export class User extends mongoose.Document {
  /** Nombre de usuario */
  @Prop({ required: true, unique: true })
  username: string;

  /** Contraseña encriptada */
  @Prop({ required: true })
  password: string;

  /** Rol del usuario */
  @Prop()
  role: Roles;

  /** Nombre real del usuario */
  @Prop()
  name: string;

  /** Apellido del usuario */
  @Prop()
  lastname: string;

  /** Correo electrónico */
  @Prop()
  email: string;

  /** Cédula de identidad */
  @Prop()
  ci: string;

  /** Fecha de nacimiento */
  @Prop()
  birth_date: Date;

  /** Altura en centímetros */
  @Prop()
  height: number;

  /** Peso en kilogramos */
  @Prop()
  weight: number;

  /** Imagen de perfil en base64 */
  @Prop()
  image: string;

  /** Bandera para soft-delete */
  @Prop({ type: Boolean, default: true })
  active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
