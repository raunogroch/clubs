// DTO para la creación de deportes
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSportDto {
  /** Nombre del deporte */
  @IsString()
  @IsNotEmpty()
  name: string;
}
