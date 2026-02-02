export class UpdatePaymentDto {
  amount?: number;
  group_id?: string;
  athlete_id?: string;
  payment_date?: string | Date | null;
  payment_start?: string | Date | null;
  payment_end?: string | Date | null;
}
