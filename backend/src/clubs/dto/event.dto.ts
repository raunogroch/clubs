/**
 * DTO para crear un evento
 */
export class CreateEventDto {
  /**
   * ID del grupo
   */
  group_id: string;

  /**
   * Nombre del evento
   */
  name: string;

  /**
   * Ubicación del evento (opcional)
   */
  location?: string;

  /**
   * Duración en minutos
   */
  duration: number;

  /**
   * Fecha del evento (YYYY-MM-DD)
   */
  eventDate: string;

  /**
   * Hora del evento (HH:mm)
   */
  eventTime: string;
}

/**
 * DTO para actualizar un evento
 */
export class UpdateEventDto {
  /**
   * Nombre del evento
   */
  name?: string;

  /**
   * Ubicación del evento
   */
  location?: string;

  /**
   * Duración en minutos
   */
  duration?: number;

  /**
   * Fecha del evento (YYYY-MM-DD)
   */
  eventDate?: string;

  /**
   * Hora del evento (HH:mm)
   */
  eventTime?: string;
}
