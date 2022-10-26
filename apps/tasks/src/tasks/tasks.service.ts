import { ajv } from '@async-arch/schema-registry';
import { TaskMessageType } from '@async-arch/types';
import { Injectable } from '@nestjs/common';
import { Task, User } from '@prisma/client';
import * as crypto from 'crypto';
import { Message, RecordMetadata } from 'kafkajs';
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
      event_id: crypto.randomUUID(),
      event_version: 1,
      event_time: Date.now().toString(),
      event_name: 'task.added',
      data: {
        ...task,
        userId: users[getRandomInt(users.length)].publicId,
        createdAt: task.createdAt.toString(),
        updatedAt: task.updatedAt.toString()
      }
    }

    if (isMessageValid(message)) {
      const recordMetadata: RecordMetadata[] = await this.producerService.produce({
        topic: 'tasks.streaming',
        messages: [{value: JSON.stringify(message)}]
      })

      console.log({recordMetadata})
      if (!recordMetadata.length) console.error({error: 'cannot create a message in Kafka'})
    } else {
      console.error('create a task: got an invalid message');
    }



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
        event_id: crypto.randomUUID(),
        event_version: 1,
        event_time: Date.now().toString(),
        event_name: 'task.reassigned',
        data: {
          ...updatedTask,
          createdAt: updatedTask.createdAt.toString(),
          updatedAt: updatedTask.updatedAt.toString()
        }
      }

      if (isMessageValid(message)) {
        messages.push({ value: JSON.stringify(message) });
      } else {
        console.error('got an invalid message');
      }

    }

    const recordMetadata: RecordMetadata[] = await this.producerService.produce(
      {
        topic: 'tasks.streaming',
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

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const taskStatus = updateTaskDto.status;

    const updatedTask = await this.dbService.updateTask(id, updateTaskDto);

    if (taskStatus === 'done') {
      const message: TaskMessageType = {
        event_id: crypto.randomUUID(),
        event_version: 1,
        event_time: Date.now().toString(),
        event_name: 'task.finished',
        data: {
          ...updatedTask,
          createdAt: updatedTask.createdAt.toString(),
          updatedAt: updatedTask.updatedAt.toString()
        }
      }

      if(isMessageValid(message)) {
        return await this.producerService.produce(
          {
            topic: 'tasks.streaming',
            messages: [{ value: JSON.stringify(message) }]
          }
        );
      } else {
        console.error('go invalid message');
      }
    }
  }

  remove(id: string) {
    return this.dbService.removeTask(id);
  }
}

function getRandomInt(max): number {
  return Math.floor(Math.random() * max);
}

function isMessageValid(message: TaskMessageType): boolean {
  const validate = ajv.getSchema<TaskMessageType>("task.message")
  console.log({validate});
  const res = validate && validate(message)
  console.log({res});
  return Boolean(res)
}