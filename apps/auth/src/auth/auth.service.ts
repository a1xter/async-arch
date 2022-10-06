import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DbService } from '../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly dbService: DbService) {}

  createUser(createUserDto: CreateUserDto): Promise<User | Error> {
    return this.dbService.createUser(createUserDto);
  }
}
