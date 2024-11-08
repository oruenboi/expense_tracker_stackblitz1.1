export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  emailVerified: boolean;
}