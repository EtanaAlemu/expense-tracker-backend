import { IExpense } from "../types";

// Expense Request DTOs
export interface CreateExpenseRequest {
  category: string;
  amount: number;
  description: string;
  date: Date;
}

export interface UpdateExpenseRequest {
  category?: string;
  amount?: number;
  description?: string;
  date?: Date;
}

// Expense Response DTOs
export class ExpenseResponse {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  user: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(expense: IExpense) {
    this.id = expense._id?.toString() || "";
    this.category = expense.category.toString();
    this.amount = expense.amount;
    this.description = expense.description || "";
    this.date = expense.date;
    this.user = expense.user.toString();
    this.createdAt = expense.createdAt || new Date();
    this.updatedAt = expense.updatedAt || new Date();
  }
}

export class ExpenseListResponse {
  expenses: ExpenseResponse[];
  total: number;

  constructor(expenses: IExpense[], total: number) {
    this.expenses = expenses.map((e) => new ExpenseResponse(e));
    this.total = total;
  }
}
