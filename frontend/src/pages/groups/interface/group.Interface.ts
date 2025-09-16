import type { User } from "../../../interfaces";

export interface Group {
  _id?: string;
  name: string;
  dailySchedules: DailySchedule[];
  place: string;
  coaches: User[];
  athletes: User[];
  active: boolean;
}

export type GroupErrors = {
  [key in keyof Group]?: string;
};

export interface GroupFormProps {
  initialData?: Group;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export enum Turn {
  MAÑANA = "mañana",
  TARDE = "tarde",
  NOCHE = "noche",
}

export enum WeekDays {
  LUNES = "Lunes",
  MARTES = "Martes",
  MIERCOLES = "Miércoles",
  JUEVES = "Jueves",
  VIERNES = "Viernes",
  SABADO = "Sábado",
  DOMINGO = "Domingo",
}

export interface DailySchedule {
  day: WeekDays | "";
  turn: Turn | "";
  startTime: string;
  endTime: string;
  active: boolean;
}
