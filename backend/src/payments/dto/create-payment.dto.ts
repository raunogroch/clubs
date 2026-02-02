export class CreatePaymentDto {
  amount: number;
  group_id: string;
  athlete_id: string;
  payment_date?: string | Date;
  payment_start?: string | Date;
  payment_end?: string | Date;
}
