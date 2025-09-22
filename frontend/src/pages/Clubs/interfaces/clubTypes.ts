import type { IGroup } from "../../groups/interface/groupTypes";
import type { Sport } from "../../Sports/interfaces";

export interface Club {
  _id?: string;
  image?: string;
  name: string;
  place: string;
  sport: Sport;
  description: string;
  groups: IGroup[];
  uniqueAthletesCount?: number;
  createdAt: string;
}

export type ClubErrors = {
  [key in keyof Club]?: string;
};

export interface ClubFormProps {
  initialData?: Club;
  onSuccess?: () => void;
  onCancel?: () => void;
}
