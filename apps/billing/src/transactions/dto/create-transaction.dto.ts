export class CreateTransactionDto {
  publicId: string;
  createdAt: Date;
  amount: number;
  type: 'credit' | 'debit' | 'payout';
  userPublicId: string;
  taskPublicId?: string;
  billingCycleId: string;
}
