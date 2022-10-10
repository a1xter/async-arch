import { Injectable } from '@nestjs/common';
import { UserInterface } from '../auth/interfaces/user.interface';
import { DbService } from '../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  create(createUserDto: CreateUserDto): Promise<UserInterface> {
    return this.dbService.createUser(createUserDto);
  }

  findAll(): Promise<UserInterface[]> {
    return this.dbService.getAllUsers();
  }

  findOne(id: string): Promise<UserInterface> {
    return this.dbService.getUserById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserInterface> {
    return this.dbService.updateUser(id, updateUserDto);
  }

  remove(id: string): Promise<UserInterface> {
    return this.dbService.removeUser(id);
  }
}
