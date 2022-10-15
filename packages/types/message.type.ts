
type UserPayload = {
  public_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin'
}

export interface UserMessageType {
    type: 'update' | 'create';
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
  type: 'created' | 'finished' | 'reassigned';
  payload: TaskPayload;
}