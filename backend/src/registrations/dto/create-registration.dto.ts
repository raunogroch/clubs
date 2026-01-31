export class CreateRegistrationDto {
  group_id: string;
  athlete_id: string;
  registration_date?: string; // ISO date string
  registration_pay?: boolean;
  monthly_payments?: string[];
}
