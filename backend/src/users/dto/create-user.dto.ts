import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Roles } from '../enum/roles.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: Roles;

  @IsString()
  name?: string;

  @IsString()
  lastname?: string;

  @IsEmail()
  email?: string;

  @IsString()
  ci?: string;

  @IsDate()
  birth_date?: Date;

  @IsNumber()
  height?: number;

  @IsNumber()
  weight?: number;
}
