import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [KafkaModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
