import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'async-arch_billing-users',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'async-arch-billing-users',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'async-arch'
          }
        }
      },
    ]),
  ],
  controllers: [UsersController]
})
export class UsersModule {}
