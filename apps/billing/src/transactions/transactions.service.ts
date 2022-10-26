import { ajv } from '@async-arch/schema-registry';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BillingCycle, Transaction, User } from '@prisma/client';
import { DbService } from '../db/db.service';
import * as crypto from 'crypto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InvalidMessageType, TransactionMessageType } from '@async-arch/types';


const validate = ajv.getSchema<TransactionMessageType>("transaction.message")


@Injectable()
export class TransactionsService {
  constructor(
    private readonly dbService: DbService,
    @Inject('async-arch_billing-transactions') private readonly client: ClientKafka
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'payout',
    timeZone: 'Europe/Moscow',
  })
  async payout() {
    const openBillingCycle: BillingCycle | null = await this.dbService.getOpenBillingCycle();

    if (openBillingCycle) {
      const cycleId = openBillingCycle.publicId;
      await this.dbService.changeBillingCycleStatus(cycleId, "processing");
      let cyclesTransactions: Transaction[] = await this.dbService.getAllCyclesTransactions(cycleId)

      const users: User[] = await this.dbService.getAllUsers();
      for (const user of users) {
        const usersTransactions = cyclesTransactions.filter((transaction) => {
          return transaction.userPublicId === user.publicId
        })

        const userBalance: { debit: number; credit: number; } = usersTransactions.reduce((acc, transaction) => {
          return { ...acc, [transaction.type]: acc[transaction.type] + transaction.amount }
        }, { debit: 0, credit: 0 })

        if (userBalance.debit - userBalance.credit + user.prevBillingCycle) {
          const transaction = await this.dbService.createTransaction({
            publicId: crypto.randomUUID(),
            billingCycleId: cycleId,
            type: 'payout',
            amount: user.balance,
            userPublicId: user.publicId,
            createdAt: new Date()
          })

          await this.dbService.updateUser(
            user.publicId,
            {
              prevBillingCycle: 0.0,
              balance: 0.0
            }
          )

          const transactionMessage: TransactionMessageType = {
            event_id: crypto.randomUUID(),
            event_version: 1,
            event_time: Date.now().toString(),
            event_name: 'transaction.payout',
            data: {
              ...transaction,
              createdAt: transaction.createdAt.toString()
            }
          }

          await this.produceMessage("payout",'transactions.streaming', transactionMessage)
        } else {
          await this.dbService.updateUser(
            user.publicId,
            {
              prevBillingCycle: userBalance.debit - userBalance.credit + user.prevBillingCycle,
              balance: userBalance.debit - userBalance.credit + user.prevBillingCycle
            }
          )
        }

        await this.dbService.changeBillingCycleStatus(cycleId, "closed");
      }
    }
  }

  async createTransaction({ userId, taskId, cycleId, type, amount, userBalance }) {
    const transaction: CreateTransactionDto = {
      publicId: crypto.randomUUID(),
      createdAt: new Date(),
      amount: getRandomInt(10, 20),
      type: type,
      userPublicId: userId,
      taskPublicId: taskId,
      billingCycleId: cycleId
    }

    await this.dbService.createTransaction(transaction)
    await this.dbService.updateUser(userId,{
      balance: type === "credit" ? userBalance - amount : userBalance + amount
    })

    await this.produceMessage("createTransaction", 'transactions.streaming', transaction)
  }

  async produceMessage(producer: string, topic: string, message: any) {
    const isMessageValid = Boolean(validate && validate(message));

    if (isMessageValid) {
      const attempts = 4;
      const delayIncrement = 2;
      let attemptDelay = 1000;
      let currentAttempt = 0;

      try {
        await this.client.emit(topic, message)
      } catch {
        while (currentAttempt < attempts) {
          setInterval(async () => {
            await this.client.emit(topic, message)
          }, attemptDelay)
          currentAttempt ++;
          attemptDelay = attemptDelay * delayIncrement;
        }
        console.log('Save invalid message - catch');
        await this.saveInvalidMessage({producer, topic, message});
      }
    } else {
      console.log('Save invalid message - isMessageValid');
      await this.saveInvalidMessage({producer, message, topic});
    }
  }

  async saveInvalidMessage({ producer = 'unknown', consumer = 'unknown', topic, message }) {
    const invalidMessage: InvalidMessageType = {
      publicId: crypto.randomUUID(),
      createdAt: new Date(),
      consumer,
      producer,
      topic,
      message
    }

    console.log({invalidMessage});
    await this.dbService.saveInvalidMessage(invalidMessage);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}