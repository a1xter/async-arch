import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TestConsumer } from './test.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [UsersController],
  providers: [UsersService, TestConsumer]
})
export class UsersModule {}
