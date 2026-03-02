/**
 * Constantes para el módulo de Schedule
 */

import { format } from "date-fns";
import { es } from "date-fns/locale";

export const CALENDAR_PALETTE = [
  "#3174ad",
  "#f50057",
  "#ff9800",
  "#4caf50",
  "#2196f3",
  "#9c27b0",
  "#00bcd4",
  "#8bc34a",
  "#ffc107",
  "#e91e63",
  "#795548",
];

export const CALENDAR_MESSAGES = {
  today: "Hoy",
  previous: "Atrás",
  next: "Siguiente",
  yesterday: "Ayer",
  tomorrow: "Mañana",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
  showMore: (total: number) => `+${total} más`,
};

export const CALENDAR_FORMATS = {
  dateFormat: "dd",
  dayFormat: "EEE dd",
  weekdayFormat: "EEE",
  monthHeaderFormat: "MMMM yyyy",
  dayHeaderFormat: "EEEE dd MMMM",
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`,
  agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`,
  agendaDateFormat: "EEE MMM dd",
  agendaTimeFormat: "HH:mm",
  agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: es })} - ${format(end, "HH:mm", { locale: es })}`,
  timeGutterFormat: "HH:mm",
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
    `${format(start, "HH:mm", { locale: es })} - ${format(end, "HH:mm", { locale: es })}`,
  eventAccessor: "title",
  resourceIdAccessor: "resourceId",
  slotLabelFormat: "HH:mm",
};

export const CALENDAR_MIN_HOUR = 8;
export const CALENDAR_MAX_HOUR = 22;
