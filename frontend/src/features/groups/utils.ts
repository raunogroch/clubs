/**
 * Utilidades para el módulo de Grupos
 *
 * Funciones helper reutilizables que encapsulan lógica común.
 */

import type { MemberDetail, Schedule } from "./types";
import { DAYS_OF_WEEK } from "./constants";

/**
 * Formatea un número como precio/moneda en Bs. (Bolivianos)
 * @param amount - Cantidad a formatear
 * @returns Precio formateado (ej: "50.00 Bs.")
 */
export function formatPrice(amount?: number): string {
  if (amount === undefined || amount === null) {
    return "Sin precio";
  }
  return `${amount.toFixed(2)} Bs.`;
}

/**
 * Obtiene el siguiente día de la semana
 * @param currentDay - Día actual (ej: "Monday")
 * @returns El siguiente día, o "Monday" si está en domingo
 *
 * @example
 * getNextDay("Monday") // Retorna "Tuesday"
 * getNextDay("Sunday") // Retorna "Monday"
 */
export function getNextDay(currentDay: string): string {
  const index = DAYS_OF_WEEK.indexOf(currentDay as any);
  if (index === -1 || index === DAYS_OF_WEEK.length - 1) {
    return DAYS_OF_WEEK[0];
  }
  return DAYS_OF_WEEK[index + 1];
}

/**
 * Obtiene el nombre del día en español
 * @param dayKey - Clave del día (ej: "Monday")
 * @returns Nombre en español (ej: "Lunes")
 */
export function getDayName(dayKey: string): string {
  const names: Record<string, string> = {
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };
  return names[dayKey] || dayKey;
}

/**
 * Crea una nueva fila de horario basada en la anterior
 * @param previousSchedule - Horario anterior para copiar tiempos
 * @returns Nueva fila de horario con día autoincrementado
 */
export function createNextScheduleRow(previousSchedule: Schedule): Schedule {
  return {
    day: getNextDay(previousSchedule.day),
    startTime: previousSchedule.startTime,
    endTime: previousSchedule.endTime,
  };
}

/**
 * Extrae detalles de miembros desde datos poblados del backend
 * @param data - Datos potencialmente poblados (objeto o ID string)
 * @returns Detalles del miembro o null
 */
export function extractMemberDetail(data: any): MemberDetail | null {
  if (!data) return null;

  // Si es un objeto poblado
  if (typeof data === "object" && data._id) {
    return {
      name: data.name || "",
      lastname: data.lastname || "",
      role: data.role || "unknown",
      ci: data.ci || "",
    };
  }

  return null;
}

/**
 * Formatea un miembro para mostrar en la UI
 * @param member - Detalle del miembro
 * @returns String formateado "CI - Apellido Nombre"
 */
export function formatMemberDisplay(member: MemberDetail): string {
  const ci = member.ci || "S/N";
  return `${ci} - ${member.lastname} ${member.name}`;
}

/**
 * Crea un mapa de detalles de miembros desde grupos
 * Útil para inicializar el estado de memberDetails
 * @param groups - Array de grupos con miembros poblados
 * @returns Map de ID -> MemberDetail
 */
export function buildMemberDetailsMap(
  groups: any[],
): Record<string, MemberDetail> {
  const details: Record<string, MemberDetail> = {};

  groups.forEach((group) => {
    // Procesar atletas
    (group.athletes || []).forEach((athlete: any) => {
      const detail = extractMemberDetail(athlete);
      if (detail && (athlete._id || typeof athlete === "string")) {
        const id = typeof athlete === "string" ? athlete : athlete._id;
        details[id] = detail;
      }
    });

    // Procesar entrenadores
    (group.coaches || []).forEach((coach: any) => {
      const detail = extractMemberDetail(coach);
      if (detail && (coach._id || typeof coach === "string")) {
        const id = typeof coach === "string" ? coach : coach._id;
        details[id] = detail;
      }
    });

    // Procesar legacy members
    (group.members || []).forEach((member: any) => {
      const detail = extractMemberDetail(member);
      if (detail && (member._id || typeof member === "string")) {
        const id = typeof member === "string" ? member : member._id;
        details[id] = detail;
      }
    });
  });

  return details;
}

/**
 * Filtra y mapea IDs de miembros válidos de un grupo
 * @param memberIds - IDs de miembros (pueden ser objetos o strings)
 * @returns Array de IDs válidos en forma de string
 */
export function extractMemberIds(memberIds: any[]): string[] {
  return memberIds
    .map((member) => {
      if (typeof member === "string") return member;
      if (typeof member === "object" && member._id) return member._id;
      return null;
    })
    .filter((id): id is string => id !== null);
}

/**
 * Valida que un horario tenga datos válidos
 * @param schedule - Horario a validar
 * @returns true si es válido
 */
export function isScheduleValid(schedule: Schedule): boolean {
  return !!(
    schedule.day &&
    schedule.startTime &&
    schedule.endTime &&
    schedule.startTime < schedule.endTime
  );
}
