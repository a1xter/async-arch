
type UserPayload = {
  public_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin'
}

export interface UserMessageType {
    event: 'user.updated' | 'user.created';
    payload: UserPayload;
}

type TaskPayload = {
  id: number
  publicId: string
  title: string
  description: string
  status: string
  createdAt: Date
  updatedAt: Date
  userId: string;
}

export interface TaskMessageType {
  event: 'task.added' | 'task.finished' | 'task.reassigned';
  payload: TaskPayload;
}