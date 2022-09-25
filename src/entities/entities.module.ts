import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';
import { TestConsumer } from './test.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [EntitiesController],
  providers: [EntitiesService, TestConsumer],
})
export class EntitiesModule {}
