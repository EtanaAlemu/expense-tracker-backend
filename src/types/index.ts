import { Types } from 'mongoose';

export interface IUser {
    _id?: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    currency?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITransaction {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    type: 'Income' | 'Expense';
    amount: number;
    category: Types.ObjectId;
    description?: string;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IBudget {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    category: Types.ObjectId;
    limit: number;
    startDate: Date;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IExpense {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    category: Types.ObjectId;
    description?: string;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICategory {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    createdAt?: Date;
    updatedAt?: Date;
} 