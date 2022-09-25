import { MinLength } from 'class-validator';

export class ProduceMessageDto {
  @MinLength(2)
  message: string;
}
