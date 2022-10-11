import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { DbService } from '../db/db.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly dbService: DbService) {}

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.dbService.createTask(createTaskDto);
  }

  findAll() {
    return this.dbService.getAllTasks();
  }

  findOne(id: string) {
    return this.dbService.getTask(id);
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.dbService.updateTask(id, updateTaskDto);
  }

  remove(id: string) {
    return this.dbService.removeTask(id);
  }
}
