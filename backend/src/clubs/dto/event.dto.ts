/**
 * DTO para crear un evento
 */
export class CreateEventDto {
  group_id: string;
  name: string;
  location?: string;
  duration: number;
  eventDate: string;
  eventTime: string;
  suspended?: boolean;
  rescheduled?: boolean;
}

/**
 * DTO para actualizar un evento
 */
export class UpdateEventDto {
  name?: string;
  location?: string;
  duration?: number;
  eventDate?: string;
  eventTime?: string;
  suspended?: boolean;
  rescheduled?: boolean;
}
