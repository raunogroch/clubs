// DTO para la creación de deportes
import { IsNotEmpty, IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateSportDto {
  /** Nombre del deporte */
  @IsString()
  @IsNotEmpty()
  name: string;

  /** Grupo administrativo propietario del deporte */
  @IsOptional()
  @IsMongoId()
  groupId?: string;
}
