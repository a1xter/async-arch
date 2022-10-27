import { Controller, Get, Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionMessageType } from '@async-arch/types';
import { ajv } from '@async-arch/schema-registry';
import { AnalyticsService } from './analytics.service';

const validate = ajv.getSchema<TransactionMessageType>('transactions.message');

@Injectable()
@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @MessagePattern('transactions.streaming')
  async consumeMessage(@Payload() message: TransactionMessageType) {
    console.log({ message });

    const isMessageValid = validate && validate(message);

    if (isMessageValid) {
      await this.analyticsService.addTransaction(message.data);
    }
  }

  @Get()
  getDashboardInfo() {
    return this.analyticsService.getDashboardInfo();
  }
}
