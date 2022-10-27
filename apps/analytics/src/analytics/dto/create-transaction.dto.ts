export class CreateTransactionDto {
  publicId: string;
  createdAt: string;
  amount: number;
  type: 'credit' | 'debit' | 'payout';
  userPublicId: string;
  taskPublicId: string;
}
