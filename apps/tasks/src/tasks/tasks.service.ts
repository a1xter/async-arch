import { TaskMessageType } from '@async-arch/types';
import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import { RecordMetadata, Message } from 'kafkajs';
import { DbService } from '../db/db.service';
import { ProducerService } from '../kafka/producer.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly dbService: DbService,
    private readonly producerService: ProducerService
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const users: User[] = await this.dbService.getAllUsers();

    const { title } = createTaskDto;

    function getIdFromTitle(title: string): { taskId: string; newTitle: string; } {
      const start = title.indexOf('[')
      const end = title.indexOf(']')
      let taskId = '';
      let newTitle = title;

      if (start >= 0 && end >= 0) {
        taskId = title.substring(start + 1, end)
        newTitle = title.substring(end + 1).trim()
      }

      return { taskId, newTitle };
    }

    const { taskId, newTitle } = getIdFromTitle(title);

    const task: Task = await this.dbService.createTask({
      ...createTaskDto,
      jiraId: taskId,
      title: newTitle,
      userId: users[getRandomInt(users.length)].publicId
    });

    const message: TaskMessageType = {
      event: 'task.added',
      payload: {...task, userId: users[getRandomInt(users.length)].publicId}
    }

    const recordMetadata: RecordMetadata[] = await this.producerService.produce({
      topic: 'tasks_cycle',
      messages: [{value: JSON.stringify(message)}]
    })

    console.log({recordMetadata})
    if (!recordMetadata.length) console.error({error: 'cannot create a message in Kafka'})

    return task;
  }

  async reassignTasks() {
    const tasks: Task[] = await this.dbService.getAllTasks()
    const users: User[] = await this.dbService.getAllUsers()
    const messages: Message[] = [];

    for (const task of tasks) {
      const filteredUsers = users.filter((user) => user.publicId !== task.userId)
      const randomUserId = filteredUsers[getRandomInt(filteredUsers.length)].publicId
      const updatedTask = await this.dbService.updateTask(
        task.publicId,
        { userId: randomUserId }
      )
      const message: TaskMessageType = {
        event: 'task.reassigned',
        payload: updatedTask
      }
      messages.push({ value: JSON.stringify(message) });
    }

    const recordMetadata: RecordMetadata[] = await this.producerService.produce(
      {
        topic: 'tasks_cycle',
        messages
    })

    console.log({recordMetadata})
    if (!recordMetadata.length) console.error({error: 'cannot create a message in Kafka'})

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

function getRandomInt(max): number {
  return Math.floor(Math.random() * max);
}