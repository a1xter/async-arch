import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  publicId: string;

  @MinLength(2)
  username: string;

  @MinLength(2)
  @IsEmail()
  email: string;

  @MinLength(2)
  role: 'user' | 'admin';
}
