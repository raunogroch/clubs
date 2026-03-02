/**
 * Funciones utilitarias para el módulo de Schedule
 */

export const getDayOffset = (day?: string): number => {
  if (!day) return 0;

  const d = day.trim().toLowerCase();

  const dayMap: Record<string, number> = {
    sunday: 0,
    sun: 0,
    domingo: 0,
    dom: 0,
    monday: 1,
    mon: 1,
    lunes: 1,
    lun: 1,
    tuesday: 2,
    tue: 2,
    martes: 2,
    mar: 2,
    wednesday: 3,
    wed: 3,
    miercoles: 3,
    miércoles: 3,
    mie: 3,
    thursday: 4,
    thu: 4,
    jueves: 4,
    jue: 4,
    friday: 5,
    fri: 5,
    viernes: 5,
    vie: 5,
    saturday: 6,
    sat: 6,
    sabado: 6,
    sábado: 6,
    sab: 6,
  };

  if (dayMap[d] !== undefined) return dayMap[d];

  const asNumber = Number(d);
  if (!Number.isNaN(asNumber) && asNumber >= 0 && asNumber <= 6) {
    return asNumber;
  }

  return 0;
};

export const getClubName = (group: any): string => {
  if (!group) return "";

  if (group.club_id) {
    if (typeof group.club_id === "object" && group.club_id.name) {
      return group.club_id.name;
    }
    if (typeof group.club_id === "string") return "";
  }

  if (group.club && typeof group.club === "object" && group.club.name) {
    return group.club.name;
  }

  if (group.club_name) return group.club_name;
  if (group.club?.name) return group.club.name;

  return "";
};

export const getAthleteFullName = (
  name?: string,
  lastname?: string,
): string => {
  const fullName = `${name || ""}${lastname ? ` ${lastname}` : ""}`.trim();
  return fullName;
};
