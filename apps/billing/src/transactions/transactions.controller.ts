import { ajv } from '@async-arch/schema-registry';
import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as crypto from 'crypto';
import { DbService } from '../db/db.service';
import { TaskMessageType } from '@async-arch/types';
import { TransactionsService } from './transactions.service';

const validate = ajv.getSchema<TaskMessageType>("task.message")

@Injectable()
export class TransactionsController {
  constructor(
    private readonly dbService: DbService,
    private readonly transactionsService: TransactionsService
  ) {}

  @MessagePattern('tasks.streaming')
  async consumeMessage(@Payload() message: TaskMessageType) {
    console.log({message});
    const isMessageValid: boolean = Boolean(validate && validate(message));

    if (isMessageValid) {
      let openBillingCycle = await this.dbService.getOpenBillingCycle();

      if (!openBillingCycle) {
        openBillingCycle = await this.dbService.createBillingCycle({
          publicId: crypto.randomUUID(),
          status: "open"
        })
      }

      let user = await this.dbService.getUser(message.data.userId);
      if (!user) {
        user = await this.dbService.createUser({
          publicId: message.data.publicId,
          username: 'unknown',
          email: 'unknown',
          role: "user",
          balance: 0.0
        })
      }

      switch (message.event_name) {
        case 'task.added':
          await this.transactionsService.createTransaction({
            userId: user.publicId,
            taskId: message.data.publicId,
            cycleId: openBillingCycle.publicId,
            type: 'credit',
            amount: getRandomInt(10, 20),
            userBalance: user.balance
          })
          console.log('add');
          break;
        case 'task.reassigned':
          await this.transactionsService.createTransaction({
            userId: user.publicId,
            taskId: message.data.publicId,
            cycleId: openBillingCycle.publicId,
            type: "credit",
            amount: getRandomInt(10, 20),
            userBalance: user.balance
          })
          console.log('reassigned');
          break;
        case 'task.finished':
          await this.transactionsService.createTransaction({
            userId: user.publicId,
            taskId: message.data.publicId,
            cycleId: openBillingCycle.publicId,
            type: "debit",
            amount: getRandomInt(20, 40),
            userBalance: user.balance
          })
          console.log('finished');
          break;
        default:
          console.error('got wrong type of message.');
      }
    }

    await this.transactionsService.saveInvalidMessage({
      consumer: 'transactions.tasks.consumer', topic: 'tasks.streaming', message
    })
  }

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}