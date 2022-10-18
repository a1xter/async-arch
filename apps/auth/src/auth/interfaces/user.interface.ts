export interface UserInterface {
  public_id: string;
  username: string;
  email: string;
  role: 'user' | 'admin'
}
