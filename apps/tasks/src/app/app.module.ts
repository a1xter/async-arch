import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from '../db/db.module';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local'
    }),
    DbModule,
    TasksModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
