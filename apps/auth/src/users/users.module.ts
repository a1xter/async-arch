import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { KafkaModule } from '../kafka/kafka.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [KafkaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
