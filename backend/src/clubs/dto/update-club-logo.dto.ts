import { IsOptional, IsString } from 'class-validator';

export class UpdateClubLogoDto {
  @IsOptional()
  @IsString()
  image?: string; // base64 data (data:...)
}
