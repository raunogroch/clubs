export interface Club {
  _id?: string;
  name: string;
  place: string;
  discipline: string;
  schedule: string;
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
