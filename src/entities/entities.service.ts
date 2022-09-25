import { Injectable } from '@nestjs/common';
import { Entity } from '@prisma/client';
import { DbService } from '../db/db.service';
import { ProducerService } from '../kafka/producer.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { ProduceMessageDto } from './dto/produce-message.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';

@Injectable()
export class EntitiesService {
  constructor(
    private readonly dbService: DbService,
    private readonly producerService: ProducerService,
  ) {}

  create(createEntityDto: CreateEntityDto): Promise<Entity> {
    return this.dbService.createEntity(createEntityDto);
  }

  findAll() {
    return this.dbService.getAllEntities();
  }

  findOne(id: number) {
    return this.dbService.getEntity(id);
  }

  update(id: number, updateEntityDto: UpdateEntityDto) {
    return this.dbService.updateEntity(id, updateEntityDto);
  }

  remove(id: number) {
    return this.dbService.removeEntity(id);
  }

  async produceMessage(produceMessageDto: ProduceMessageDto) {
    return await this.producerService.produce({
      topic: 'test',
      messages: [{ value: produceMessageDto.message }],
    });
  }
}
