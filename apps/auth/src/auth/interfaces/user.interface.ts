export interface UserInterface {
  publicId: string;
  username: string;
  email: string;
  role: 'user' | 'admin'
}
