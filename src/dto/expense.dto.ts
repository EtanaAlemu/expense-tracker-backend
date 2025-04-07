import { IExpense } from '../types';

// Expense Request DTOs
export interface CreateExpenseRequest {
    amount: number;
    category: string;
    description: string;
    date: Date;
    receipt?: string;
}

export interface UpdateExpenseRequest {
    amount?: number;
    category?: string;
    description?: string;
    date?: Date;
    receipt?: string;
}

// Expense Response DTOs
export class ExpenseResponse {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: Date;
    receipt?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(expense: IExpense) {
        this.id = expense._id;
        this.amount = expense.amount;
        this.category = expense.category;
        this.description = expense.description;
        this.date = expense.date;
        this.receipt = expense.receipt;
        this.userId = expense.userId;
        this.createdAt = expense.createdAt;
        this.updatedAt = expense.updatedAt;
    }
}

export class ExpenseListResponse {
    expenses: ExpenseResponse[];
    total: number;

    constructor(expenses: IExpense[], total: number) {
        this.expenses = expenses.map(e => new ExpenseResponse(e));
        this.total = total;
    }
} 