import { ITransaction } from "../types";

// Transaction Request DTOs
export interface CreateTransactionRequest {
  _id?: string;
  amount: number;
  type: "Income" | "Expense";
  title: string;
  category: string;
  description: string;
  date: Date;
}

export interface UpdateTransactionRequest {
  id?: string;
  user?: string;
  amount?: number;
  title?: string;
  description?: string;
  type?: string;
  category?: string;
  date?: Date;
  isSynced?: boolean;
}

// Transaction Response DTOs
export class TransactionResponse {
  id: string;
  amount: number;
  type: "Income" | "Expense";
  title: string;
  category: string;
  description: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(transaction: ITransaction) {
    this.id = transaction._id?.toString() || "";
    this.amount = transaction.amount;
    this.type = transaction.type;
    this.title = transaction.title;
    this.category = transaction.category?.toString() || "";
    this.description = transaction.description || "";
    this.date = transaction.date;
    this.userId = transaction.user?.toString() || "";
    this.createdAt = transaction.createdAt || new Date();
    this.updatedAt = transaction.updatedAt || new Date();
  }
}

export class TransactionListResponse {
  transactions: TransactionResponse[];
  total: number;

  constructor(transactions: ITransaction[], total: number) {
    this.transactions = transactions.map((t) => new TransactionResponse(t));
    this.total = total;
  }
}
