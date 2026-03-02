/**
 * Tipos e interfaces para el módulo de Schedule
 */

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface CalendarEventData {
  _id: string;
  name: string;
  location: string;
  duration: number;
  eventDate: string;
  eventTime: string;
}

export interface Group {
  _id: string;
  name: string;
  club_id: {
    _id: string;
    name: string;
  };
  athletes?: Array<{ _id?: string; name?: string; lastname?: string }>;
  schedule?: Schedule[];
  schedules_added?: Schedule[];
  events_added?: CalendarEventData[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  eventType: "schedule" | "event";
  resource?: {
    club: string;
    group: string;
    athleteId?: string;
    athleteName?: string;
    athletes?: Array<{ _id: string; name: string; lastname?: string }>;
    location?: string;
  };
}

export interface Athlete {
  _id: string;
  name: string;
  lastname?: string;
}

export interface AthleteColorMap {
  [key: string]: string;
}
