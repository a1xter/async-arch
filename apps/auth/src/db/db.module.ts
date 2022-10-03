import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [DbService, PrismaService],
  exports: [DbService],
})
export class DbModule {}
