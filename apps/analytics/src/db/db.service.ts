import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto } from '../analytics/dto/create-transaction.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }
}
