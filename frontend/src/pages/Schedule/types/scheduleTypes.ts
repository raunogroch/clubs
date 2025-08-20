export interface Schedule {
  _id?: string;
  startTime: string;
  endTime: string;
}

export type ScheduleErrors = {
  [key in keyof Schedule]?: string;
};

export interface ScheduleFormProps {
  initialData?: Schedule;
  onSuccess?: () => void;
  onCancel?: () => void;
}
