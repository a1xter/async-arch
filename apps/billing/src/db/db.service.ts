import { Injectable } from '@nestjs/common';
import { Transaction, BillingCycle, User, InvalidMessage } from '@prisma/client';
import { CreateCycleDto } from '../transactions/dto/create-cycle.dto';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { PrismaService } from './prisma.service';
import { InvalidMessageType } from '@async-arch/types';

@Injectable()
export class DbService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: { ...createUserDto }
    })
  }

  async updateUser(userPublicId: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {publicId: userPublicId},
      data: { ...data }}
    )
  }

  async getUser(publicId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({where: { publicId }})
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
     return await this.prisma.transaction.create({data: createTransactionDto})
  }

  async createBillingCycle(
    createCycleDto: CreateCycleDto
  ): Promise<BillingCycle> {
    return await this.prisma.billingCycle.create({data: createCycleDto})
  }

  async getOpenBillingCycle(): Promise<BillingCycle | null> {
    return await this.prisma.billingCycle.findFirst({
      where: { status: 'open' }
    })
  }

  async changeBillingCycleStatus(
    publicId: string, status: "open" | "processing" | "closed"
  ) {
    return await this.prisma.billingCycle.update({
      where: { publicId },
      data: { status }}
    )
  }

  async getAllCyclesTransactions(cyclePublicId: string) {
    return this.prisma.transaction.findMany({
      where: { billingCycleId: cyclePublicId }
    })
  }

  async saveInvalidMessage(message: InvalidMessageType): Promise<InvalidMessage> {
    return this.prisma.invalidMessage.create({ data: message })
  }
}
