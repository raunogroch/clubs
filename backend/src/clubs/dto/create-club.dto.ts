// DTO para la creación de clubes
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateClubDto {
  /** Nombre del club */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Imagen de perfil en base64 */
  @IsString()
  image?: string;

  /** Disciplina deportiva asociada */
  @IsNotEmpty()
  @IsMongoId({ each: true })
  sport: Types.ObjectId;

  /** Una breve descripcion del club */
  @IsString()
  @IsNotEmpty()
  description?: string;

  /** Grupo de entrenamiento asociado */
  @IsMongoId({ each: true })
  group: Types.ObjectId;
}
