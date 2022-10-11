import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

import { DbModule } from '../db/db.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DbModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
