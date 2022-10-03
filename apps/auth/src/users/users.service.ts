import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DbService } from '../db/db.service';
import { ProducerService } from '../kafka/producer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ProduceMessageDto } from './dto/produce-message.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly producerService: ProducerService
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.dbService.createUser(createUserDto);
  }

  findAll() {
    return this.dbService.getAllUsers();
  }

  findOne(id: number) {
    return this.dbService.getUser(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.dbService.updateUser(id, updateUserDto);
  }

  remove(id: number) {
    return this.dbService.removeUser(id);
  }

  async produceMessage(produceMessageDto: ProduceMessageDto) {
    return await this.producerService.produce({
      topic: 'test',
      messages: [{ value: produceMessageDto.message }]
    });
  }
}
