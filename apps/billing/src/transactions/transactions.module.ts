import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { TransactionsConsumer } from './transactions.consumer';

@Module({
    imports: [KafkaModule],
    providers: [TransactionsConsumer]
})
export class TransactionsModule {}
