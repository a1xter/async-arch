import { MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(2)
  name: string;

  @MinLength(2)
  email: string;

  @MinLength(2)
  password: string;
}
