/**
 * DTO para crear horario
 */

export class CreateScheduleDto {
  /**
   * Día de la semana
   * Valores: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
   */
  day: string;

  /**
   * Hora de inicio (HH:mm)
   */
  startTime: string;

  /**
   * Hora de fin (HH:mm)
   */
  endTime: string;
}
