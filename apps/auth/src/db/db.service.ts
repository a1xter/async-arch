import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: { ...createUserDto }
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUser(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async updateUser(id: number, updateEntityDto: UpdateUserDto): Promise<User> {
    const { name } = updateEntityDto;
    return this.prisma.user.update({
      where: { id },
      data: { name }
    });
  }

  async removeUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
