export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
