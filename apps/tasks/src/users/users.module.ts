import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { UsersConsumer } from './users.consumer';

@Module({
    imports: [KafkaModule],
    providers: [UsersConsumer]
})
export class UsersModule {}
