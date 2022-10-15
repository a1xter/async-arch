import { IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @MinLength(2)
  @IsString()
  title: string;

  @MinLength(2)
  @IsString()
  description: string;
}

export interface CreateTaskInterface extends CreateTaskDto {
  userId: string;
}