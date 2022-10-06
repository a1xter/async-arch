import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | Error> {
    try {
      const result = await this.prisma.user.create({
        data: { ...createUserDto }
      });
      return result;
    } catch (e) {
      console.log({ e });
      console.log({ code: e.code, meta: e.meta });
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        //unique field
        if (e.code === 'P2002') {
          return new Error(`a new user cannot be created with this ${e.meta.target[0]}`);
        }
      }
      return e;
    }
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
    const { username } = updateEntityDto;
    return this.prisma.user.update({
      where: { id },
      data: { username }
    });
  }

  async removeUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
