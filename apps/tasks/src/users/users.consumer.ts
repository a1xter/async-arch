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
        { topics: ['streaming.users'] },
        {
          eachMessage: async (payload) => {
            const message: UserMessageType = JSON.parse(payload.message.value.toString())
            const {username, email, role, public_id } = message.payload;
            console.log({ message });
            switch (message.type) {
              case 'create':
                console.log('create');
                await this.dbService.createUser({
                  username,
                  email,
                  role,
                  publicId: public_id
                })
                break;
              case 'update':
                console.log('update');
                await this.dbService.updateUser({
                  username,
                  email,
                  role,
                  publicId: public_id
                })
                break;
            }

          },
        },
      );
    }
}