import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ConsumerService } from '../kafka/consumer.service';

 /*
    1. get a message with task
    2. validate a message
    3. check event_name of message
    3. create a transaction
    4. produce a message with transaction
 */

@Injectable()
export class TransactionsConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly dbService: DbService
  ) {}

    async onModuleInit() {
      await this.consumerService.consume(
        { topics: ['tasks_cycle'] },
        {
          eachMessage: async (payload) => {

            console.log(payload);

          },
        },
      );
    }
}