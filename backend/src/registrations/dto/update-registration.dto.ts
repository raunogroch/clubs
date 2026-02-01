export class UpdateRegistrationDto {
  registration_date?: string;
  registration_pay?: string | Date | null; // ISO date string or null to set payment date
  registration_amount?: number; // Monto del pago de la matrícula
  monthly_payments?: string[];
}
