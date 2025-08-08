import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

class UserBasic {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  roles: string[];
}
export class CreateUserDto extends UserBasic {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  ci: string;

  @IsDate()
  birth_date: Date;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;
}

export class CreateSuperUserDto extends UserBasic {}
