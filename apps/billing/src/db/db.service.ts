import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

}
