import type { User } from "../../../interfaces";

export interface IGroup {
  _id?: string;
  name: string;
  dailySchedules: DailySchedule[];
  place: string;
  coaches: User[];
  athletes: User[];
  images: {
    small: string;
    medium: string;
    large: string;
  };
  active: boolean;
}

export type GroupErrors = {
  [key in keyof IGroup]?: string;
};

export interface GroupFormProps {
  initialData?: IGroup;
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
