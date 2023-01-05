import { ajv } from '@async-arch/schema-registry';
import { Controller } from '@nestjs/common';
import { UserMessageType } from '@async-arch/types';
import { MessagePattern, Payload, } from '@nestjs/microservices';
import { DbService } from '../db/db.service';

const validate = ajv.getSchema<UserMessageType>("user.message")

@Controller()
export class UsersController {
  constructor(private readonly dbService: DbService) {}

  @MessagePattern('users.streaming')
  async consumeMessages(@Payload() message: any) {

    const isMessageValid: boolean = Boolean(validate && validate(message));

    if (isMessageValid) {
      console.log({ message });

      switch (message.event_name) {
        case 'user.created':
          console.log('create');
          await this.dbService.createUser({
            ...message.data,
            balance: 0.0
          })
          break;
        case 'user.updated':
          console.log('update');
          await this.dbService.updateUser(message.data.publicId, {...message.data})
          break;
      }
    } else {
      console.log('got an invalid message');
    }

  }
}