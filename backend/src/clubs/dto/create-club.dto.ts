// DTO para la creación de clubes
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateClubDto {
  /** Nombre del club */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Lugar donde se ubica el club */
  @IsString()
  @IsNotEmpty()
  place: string;

  /** Disciplina deportiva asociada */
  @IsString()
  @IsNotEmpty()
  discipline: string;

  /** Horario asociado al club */
  @IsNotEmpty()
  @IsMongoId({ each: true })
  schedule: Types.ObjectId;

  /** Lista de entrenadores */
  @IsArray()
  @IsMongoId({ each: true })
  coaches: Types.ObjectId[];

  /** Lista de atletas */
  @IsArray()
  @IsMongoId({ each: true })
  athletes: Types.ObjectId[];

  /** Imagen de perfil en base64 */
  @IsString()
  image?: string;
}
