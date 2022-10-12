interface MessageInterface {
    payload: Payload;
}

interface Payload {
  public_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin'
}

export interface UserMessageType extends MessageInterface {
    type: 'update' | 'create';
}
