export interface User {
  id: UserId;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  role: UserRole;
}

export type UserId = number;
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN"
}