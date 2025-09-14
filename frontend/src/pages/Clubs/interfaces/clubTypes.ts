import type { Sport } from "../../Sports/interfaces";

export interface Club {
  _id?: string;
  image?: string;
  name: string;
  place: string;
  sport: Sport;
  description: string;
}

export type ClubErrors = {
  [key in keyof Club]?: string;
};

export interface ClubFormProps {
  initialData?: Club;
  onSuccess?: () => void;
  onCancel?: () => void;
}
