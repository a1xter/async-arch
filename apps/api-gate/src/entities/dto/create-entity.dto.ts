import { MinLength } from 'class-validator';

export class CreateEntityDto {
  @MinLength(2)
  name: string;
}
