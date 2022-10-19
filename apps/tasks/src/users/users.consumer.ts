import { isDataValid, userMessageSchema } from '@async-arch/schema-registry';
import { UserMessageType } from '@async-arch/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ConsumerService } from '../kafka/consumer.service';

@Injectable()
export class UsersConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly dbService: DbService
  ) {}

    async onModuleInit() {
      await this.consumerService.consume(
        { topics: ['streaming.users'], fromBeginning: true },
        {
          eachMessage: async (payload) => {
            const message: UserMessageType = payload.message.value
              ? JSON.parse(payload.message.value.toString())
              : {}
            const isValid: boolean = isDataValid(userMessageSchema, message);

            if (isValid) {
              const { username, email, role, public_id } = message.data;
              console.log({ message });

              switch (message.event_name) {
                case 'user.created':
                  console.log('create');
                  await this.dbService.createUser({
                    username,
                    email,
                    role,
                    publicId: public_id
                  })
                  break;
                case 'user.updated':
                  console.log('update');
                  await this.dbService.updateUser({
                    username,
                    email,
                    role,
                    publicId: public_id
                  })
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