import { IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @MinLength(2)
  @IsString()
  title: string;

  @MinLength(2)
  @IsString()
  description: string;
}
