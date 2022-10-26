import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local'
    }),
    ScheduleModule.forRoot(),
    DbModule,
    TransactionsModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
