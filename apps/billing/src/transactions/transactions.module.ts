import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'async-arch_billing-transactions',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'async-arch-billing-transactions',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'async-arch'
                    }
                }
            },
        ]),
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService]
})
export class TransactionsModule {}
