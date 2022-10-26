
export type UserPayload = {
  publicId: string;
  username: string;
  email: string;
  role: 'user' | 'admin'
}

export type UserMessageType = {
  event_id: string;
  event_version: number;
  event_name: 'user.updated' | 'user.created';
  event_time: string;
  data: UserPayload;
}

type TaskPayload = {
  id: number;
  publicId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type TaskMessageType = {
  event_id: string;
  event_version: number;
  event_name: 'task.added' | 'task.finished' | 'task.reassigned';
  event_time: string;
  data: TaskPayload;
}

type TransactionPayload = {
  publicId: string;
  createdAt: string;
  amount: number;
  type: "credit" | "debit" | "payout"
  userPublicId: string;
  taskPublicId: string;
  billingCycleId: string;
}

export type TransactionMessageType = {
  event_id: string;
  event_version: number;
  event_name: 'transaction.credit' | 'transaction.debit' | 'transaction.payout';
  event_time: string;
  data: TransactionPayload;
}

export type InvalidMessageType = {
  publicId: string;
  createdAt: Date;
  topic: string;
  producer: string;
  consumer: string;
  message: TaskMessageType | TransactionMessageType | UserMessageType;
}
