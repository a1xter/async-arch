import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'async-arch-analytics-money',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'async-arch-analytics-money',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'async-arch',
          },
        },
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
