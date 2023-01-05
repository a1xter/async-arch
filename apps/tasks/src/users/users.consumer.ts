import { ajv } from '@async-arch/schema-registry';
import { UserMessageType } from '@async-arch/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ConsumerService } from '../kafka/consumer.service';

const validate = ajv.getSchema<UserMessageType>("user.message")

@Injectable()
export class UsersConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly dbService: DbService
  ) {}

    async onModuleInit() {
      await this.consumerService.consume(
        { topics: ['users.streaming'], fromBeginning: true },
        {
          eachMessage: async (payload) => {
            const message: UserMessageType = JSON.parse(JSON.stringify(payload.message.value))
            const isValid: boolean = Boolean(validate && validate(message));

            if (isValid) {
              console.log({ message });

              switch (message.event_name) {
                case 'user.created':
                  console.log('create');
                  await this.dbService.createUser({ ...message.data })
                  break;
                case 'user.updated':
                  console.log('update');
                  await this.dbService.updateUser({ ...message.data })
                  break;
              }
            } else {
              console.log('got an invalid message');
            }

          },
        },
      );
    }
}