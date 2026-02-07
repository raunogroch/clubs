/**
 * DTO para crear schedule
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

/**
 * DTO para actualizar schedule
 */
export class UpdateScheduleDto {
  /**
   * Día de la semana
   */
  day?: string;

  /**
   * Hora de inicio (HH:mm)
   */
  startTime?: string;

  /**
   * Hora de fin (HH:mm)
   */
  endTime?: string;
}
