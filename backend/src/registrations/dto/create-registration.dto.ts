export class CreateRegistrationDto {
  group_id: string;
  athlete_id: string;
  registration_date?: string; // ISO date string
  registration_pay?: string | Date | null; // ISO date string or null
  monthly_payments?: string[];
  assignment_id?: string;
}
