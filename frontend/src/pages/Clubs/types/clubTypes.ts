import type { Sport } from "../../Sports/types/sportTypes";

interface Schedule {
  startTime: string;
  endTime: string;
}
export interface Club {
  _id?: string;
  name: string;
  schedule: Schedule;
  place: string;
  discipline: Sport;
  coaches: string[];
  athletes: string[];
}

export type ClubErrors = {
  [key in keyof Club]?: string;
};

export interface ClubFormProps {
  initialData?: Club;
  onSuccess?: () => void;
  onCancel?: () => void;
}
