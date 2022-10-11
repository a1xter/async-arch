import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { PrismaService } from './prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const publicId = crypto.randomUUID();

    return this.prisma.task.create({
      data: {
        title,
        description,
        publicId,
      },
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async getTask(id: string): Promise<Task> {
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
}
