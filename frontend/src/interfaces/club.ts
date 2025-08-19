export interface Club {
  id?: string;
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
