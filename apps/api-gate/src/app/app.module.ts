import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from '../db/db.module';
import { EntitiesModule } from '../entities/entities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    EntitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
