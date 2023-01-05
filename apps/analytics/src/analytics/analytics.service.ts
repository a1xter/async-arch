import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { DbService } from '../db/db.service';
import { TransactionPayload } from '@async-arch/types';
import { DateTime } from 'luxon';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dbService: DbService) {}

  async addTransaction(transaction: TransactionPayload) {
    await this.dbService.createTransaction(transaction);
  }

  async getDashboardInfo() {
    const transactions: Transaction[] =
      await this.dbService.getAllTransactions();

    const currentDayTransactions = transactions.filter((transaction) => {
      return (
        DateTime.fromJSDate(transaction.createdAt, {
          zone: 'Europe/Moscow',
        }).toISODate() === DateTime.local({ zone: 'Europe/Moscow' }).toISODate()
      );
    });

    const mostExpensiveTaskToday = currentDayTransactions.reduce(
      (acc, transaction) => {
        if (acc.amount < transaction.amount) {
          return {
            taskPublicId: transaction.taskPublicId,
            amount: transaction.amount,
          };
        }
        return acc;
      },
      { taskPublicId: 'unknown', amount: 0 },
    );

    const balance = currentDayTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'debit')
          return { ...acc, debit: acc.debit + transaction.amount };
        return { ...acc, credit: acc.credit + transaction.amount };
      },
      { debit: 0, credit: 0 },
    );

    const managersSalary = balance.credit - balance.debit;

    return {
      currentDayTransactions,
      mostExpensiveTaskToday,
      managersSalary,
    };
  }
}
