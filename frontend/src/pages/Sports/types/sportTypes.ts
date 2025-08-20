export interface Sport {
  _id?: string;
  name: string;
}

export type SportErrors = {
  [key in keyof Sport]?: string;
};

export interface SportFormProps {
  initialData?: Sport;
  onSuccess?: () => void;
  onCancel?: () => void;
}
