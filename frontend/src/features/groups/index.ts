/**
 * Índice de exportación del módulo de Grupos
 * 
 * Facilita las importaciones desde otros módulos
 */

export { Groups as default } from './Groups.page';
export type {
  Group,
  Sport,
  User,
  MemberDetail,
  Schedule,
  CreateGroupRequest,
  UpdateGroupRequest,
} from './types';
export { MESSAGES, DAYS_OF_WEEK, DEFAULT_SCHEDULE } from './constants';
export * from './utils';
