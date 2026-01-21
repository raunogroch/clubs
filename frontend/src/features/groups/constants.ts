/**
 * Constantes del módulo de Grupos
 *
 * Centraliza valores constantes para evitar magic strings/numbers
 * y facilitar mantenimiento.
 */

import { DayName } from "./types/index";

/**
 * Orden de los días de la semana
 */
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/**
 * Mapeo de días en inglés a español
 */
export const DAY_NAMES = DayName;

/**
 * Horario por defecto para nuevas sesiones
 */
export const DEFAULT_SCHEDULE = {
  day: "Monday",
  startTime: "09:00",
  endTime: "10:00",
};

/**
 * Mensajes de error/éxito (i18n-ready)
 */
export const MESSAGES = {
  // Errores de validación
  ERROR_GROUP_NAME_REQUIRED: "El nombre del grupo es requerido",
  ERROR_CI_REQUIRED: "Ingresa un carnet (CI) válido",
  ERROR_MEMBER_TYPE_REQUIRED: "Selecciona el tipo de usuario (Coach o Atleta)",
  ERROR_USER_NOT_SELECTED: "Selecciona un usuario primero",
  ERROR_USER_NAME_REQUIRED: "El nombre es requerido",
  ERROR_USER_LASTNAME_REQUIRED: "El apellido es requerido",
  ERROR_USER_USERNAME_REQUIRED: "El usuario es requerido",
  ERROR_AT_LEAST_ONE_SCHEDULE: "Debe agregar al menos un horario",

  // Confirmaciones
  CONFIRM_DELETE_GROUP: "¿Estás seguro de que deseas eliminar este grupo?",
  CONFIRM_DELETE_SCHEDULE: "¿Estás seguro de que deseas eliminar este horario?",

  // Éxito
  SUCCESS_GROUP_CREATED: "Grupo creado correctamente",
  SUCCESS_GROUP_UPDATED: "Grupo actualizado correctamente",
  SUCCESS_GROUP_DELETED: "Grupo eliminado correctamente",
  SUCCESS_MEMBER_ADDED: "agregado correctamente",
  SUCCESS_SCHEDULES_SAVED: "Horarios guardados correctamente",
  SUCCESS_SCHEDULE_DELETED: "Horario eliminado correctamente",
  SUCCESS_USER_CREATED: "creado correctamente",

  // Información
  INFO_MEMBER_NOT_FOUND: "no encontrado. Puedes crear uno.",
  INFO_MEMBER_ROLE_MISMATCH:
    "El usuario encontrado es {{role}}, pero se busca un {{expectedRole}}",

  // Estados
  STATE_LOADING: "Cargando grupos...",
  STATE_NO_GROUPS:
    "No hay grupos creados en este club. Crea uno nuevo para comenzar.",
  STATE_EDITING_SCHEDULES: "Editando horarios...",
  STATE_NO_SCHEDULES: "Sin horarios asignados",
  STATE_NO_COACHES: "Sin entrenadores asignados",
  STATE_NO_ATHLETES: "Sin deportistas asignados",
};

/**
 * Límites y configuraciones
 */
export const CONFIG = {
  MAX_MEMBERS_LIST_HEIGHT: 300, // px
  SCHEDULE_MODAL_MAX_HEIGHT: 400, // px
  BATCH_SIZE_MEMBER_DETAILS: 50, // Items por batch al cargar detalles
};
