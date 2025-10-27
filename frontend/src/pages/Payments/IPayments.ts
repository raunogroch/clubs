export interface Athlete {
  _id: string;
  name: string;
  lastname?: string;
  email?: string;
}

export interface Club {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  city?: string;
  monthly_pay?: number;
}

export interface Payment {
  _id?: string;
  athlete: string | Athlete;
  club: string | Club;
  amount: number;
  month?: string; // YYYY-MM
  note?: string;
  createdAt?: string;
}

export interface CreatePaymentDto {
  athleteId: string;
  clubId: string;
  amount?: number;
  note?: string;
  month?: string;
}
