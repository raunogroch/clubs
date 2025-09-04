// DTO para la actualización de clubes
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class UpdateClubDto {
  /** Nombre del club */
  @IsString()
  @IsOptional()
  name?: string;

  /** Lugar donde se ubica el club */
  @IsString()
  @IsOptional()
  place?: string;

  /** Disciplina deportiva asociada */
  @IsString()
  @IsOptional()
  discipline?: string;

  /** Horario asociado al club */
  @IsNotEmpty()
  @IsMongoId({ each: true })
  schedule: Types.ObjectId;

  /** Lista de entrenadores */
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  coaches?: Types.ObjectId[];

  /** Lista de atletas */
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  athletes?: Types.ObjectId[];

  /** Imagen de perfil en base64 */
  @IsString()
  image?: string;
}
