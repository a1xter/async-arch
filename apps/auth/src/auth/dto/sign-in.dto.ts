import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @MinLength(3)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
