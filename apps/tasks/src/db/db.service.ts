import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { CreateTaskInterface } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from './prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(task: CreateTaskInterface): Promise<Task> {
    const publicId = crypto.randomUUID();

    return this.prisma.task.create({
      data: { ...task, publicId },
    });
  }

  async getAllTasks(): Promise<Task[]> {

    return this.prisma.task.findMany({where: { status: 'open' }});
  }

  async getTask(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { publicId: id },
    });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { publicId: id },
      data: { ...updateTaskDto },
    });
  }

  async removeTask(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { publicId: id },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: { ...createUserDto }
    })
  }

  async updateUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { publicId: createUserDto.publicId },
      data: { ...createUserDto }
    })

  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany()
  }
}
