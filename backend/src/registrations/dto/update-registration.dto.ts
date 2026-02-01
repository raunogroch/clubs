export class UpdateRegistrationDto {
  registration_date?: string;
  registration_pay?: string | Date | null; // ISO date string or null to set payment date
  monthly_payments?: string[];
}
