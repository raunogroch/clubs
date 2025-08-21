export interface Club {
  _id?: string;
  name: string;
  schedule: string;
  sport: string;
  place: string;
  discipline: string;
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
