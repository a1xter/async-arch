import { Injectable } from '@nestjs/common';
import { Entity } from '@prisma/client';
import { CreateEntityDto } from '../entities/dto/create-entity.dto';
import { UpdateEntityDto } from '../entities/dto/update-entity.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntity(createEntityDto: CreateEntityDto): Promise<Entity> {
    const { name } = createEntityDto;
    return this.prisma.entity.create({
      data: { name },
    });
  }

  async getAllEntities(): Promise<Entity[]> {
    return this.prisma.entity.findMany();
  }

  async getEntity(id: number): Promise<Entity> {
    return this.prisma.entity.findUnique({
      where: { id },
    });
  }

  async updateEntity(
    id: number,
    updateEntityDto: UpdateEntityDto,
  ): Promise<Entity> {
    const { name } = updateEntityDto;
    return this.prisma.entity.update({
      where: { id },
      data: { name },
    });
  }

  async removeEntity(id: number): Promise<Entity> {
    return this.prisma.entity.delete({
      where: { id },
    });
  }
}
