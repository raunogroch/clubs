export interface Clubs {
  _id?: string;
  name: string;
  schedule: {
    startTime: string;
    endTime: string;
  };
  place: string;
  discipline: string;
  coaches: string[];
  athletes: string[];
}

export type ClubErrors = {
  [key in keyof Clubs]?: string;
};

export interface ClubFormProps {
  initialData?: Clubs;
  onSuccess?: () => void;
  onCancel?: () => void;
}
