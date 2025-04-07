import { ITransaction } from '../types';

// Transaction Request DTOs
export interface CreateTransactionRequest {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: Date;
}

export interface UpdateTransactionRequest {
    amount?: number;
    type?: 'income' | 'expense';
    category?: string;
    description?: string;
    date?: Date;
}

// Transaction Response DTOs
export class TransactionResponse {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(transaction: ITransaction) {
        this.id = transaction._id;
        this.amount = transaction.amount;
        this.type = transaction.type;
        this.category = transaction.category;
        this.description = transaction.description;
        this.date = transaction.date;
        this.userId = transaction.userId;
        this.createdAt = transaction.createdAt;
        this.updatedAt = transaction.updatedAt;
    }
}

export class TransactionListResponse {
    transactions: TransactionResponse[];
    total: number;

    constructor(transactions: ITransaction[], total: number) {
        this.transactions = transactions.map(t => new TransactionResponse(t));
        this.total = total;
    }
} 