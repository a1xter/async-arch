import { UserMessageType } from '@async-arch/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RecordMetadata } from 'kafkajs';
import { UserInterface } from '../auth/interfaces/user.interface';
import { DbService } from '../db/db.service';
import { ProducerService } from '../kafka/producer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
      private readonly dbService: DbService,
      private readonly producerService: ProducerService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const user = await this.dbService.createUser(createUserDto);
    if (!user) throw new InternalServerErrorException();

    const message: UserMessageType = {
      type: 'create',
      payload: user
    }

    const recordMetadata: RecordMetadata[] = await this.producerService.produce({
      topic: 'users_sync',
      messages: [{value: JSON.stringify(message)}]
    })
    console.log({recordMetadata})
    if (!recordMetadata.length) console.error({error: 'cannot create a message in Kafka'})

    return user;
  }

  findAll(): Promise<UserInterface[]> {
    return this.dbService.getAllUsers();
  }

  findOne(id: string): Promise<UserInterface> {
    return this.dbService.getUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserInterface> {
    const user = await this.dbService.updateUser(id, updateUserDto);
    if (!user) throw new InternalServerErrorException();

    const message: UserMessageType = {
      type: 'update',
      payload: user
    }
    const recordMetadata: RecordMetadata[] = await this.producerService.produce({
      topic: 'users_sync',
      messages: [{value: JSON.stringify(message)}]
    })
    console.log({recordMetadata});
    if (!recordMetadata.length) console.error({error: 'cannot create a message in Kafka'});

    return user;
  }

  remove(id: string): Promise<UserInterface> {
    return this.dbService.removeUser(id);
  }
}
