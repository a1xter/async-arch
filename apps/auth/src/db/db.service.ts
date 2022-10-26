import {
  ConflictException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as crypto from 'crypto';
import { UserInterface } from '../auth/interfaces/user.interface';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const publicId = crypto.randomUUID();
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, publicId }
      });

      return this.transformUserObject(user);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        //unique field
        if (e.code === 'P2002') {
          throw new ConflictException(
            `a new user cannot be created with this ${e.meta.target[0]}`
          );
        }
      }
      throw new InternalServerErrorException(e);
    }
  }

  async getAllUsers(): Promise<UserInterface[]> {
    try {
      const usersOutput = [];
      const users = await this.prisma.user.findMany();

      for (const user of users) {
        usersOutput.push({
          public_id: user.publicId,
          username: user.username,
          email: user.email,
          role: user.role
        });
      }

      return usersOutput;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getUserById(id: string): Promise<UserInterface> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { publicId: id }
      });
      return this.transformUserObject(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return this.prisma.user.findUnique({
        where: { email }
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updateUser(
    id: string,
    updateEntityDto: UpdateUserDto
  ): Promise<UserInterface> {
    try {
      const user = await this.prisma.user.update({
        where: { publicId: id },
        data: { ...updateEntityDto }
      });

      return this.transformUserObject(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeUser(id: string): Promise<UserInterface> {
    try {
      const user = await this.prisma.user.delete({
        where: { publicId: id }
      });

      return this.transformUserObject(user);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  transformUserObject(user: User): UserInterface {
    return {
      publicId: user.publicId,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}
