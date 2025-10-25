import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Matches,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  athleteId: string;

  @IsNotEmpty()
  @IsString()
  clubId: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'month debe tener formato YYYY-MM',
  })
  month?: string; // formato recomendado YYYY-MM

  @IsOptional()
  @IsString()
  note?: string;
}
