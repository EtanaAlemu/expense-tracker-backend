export interface IUser {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITransaction {
    _id: string;
    amount: number;
    type: 'Income' | 'Expense';
    category: string;
    description: string;
    date: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBudget {
    _id: string;
    category: string;
    limit: number;
    startDate: Date;
    endDate: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IExpense {
    _id: string;
    amount: number;
    category: string;
    description: string;
    date: Date;
    receipt?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
} 