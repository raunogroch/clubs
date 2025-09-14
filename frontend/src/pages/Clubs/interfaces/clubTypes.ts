import type { User } from "../../Users/interfaces/userTypes";

export interface Club {
  _id?: string;
  image?: string;
  name: string;
  place: string;
  discipline: {
    _id: string;
    name: string;
  };
  schedule: string;
  coaches: string[];
  athletes: User[];
}

export type ClubErrors = {
  [key in keyof Club]?: string;
};

export interface ClubFormProps {
  initialData?: Club;
  onSuccess?: () => void;
  onCancel?: () => void;
}
