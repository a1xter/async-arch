import { Module } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { EntitiesController } from './entities.controller';

@Module({
  controllers: [EntitiesController],
  providers: [EntitiesService],
})
export class EntitiesModule {}
