// DTO para la creación de horarios
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  /** Hora de inicio del horario */
  @IsString()
  @IsNotEmpty()
  startTime: string;

  /** Hora de fin del horario */
  @IsString()
  @IsNotEmpty()
  endTime: string;
}
