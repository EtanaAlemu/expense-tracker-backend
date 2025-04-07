import mongoose, { Document, Model } from 'mongoose';
import { IExpense } from '../types';
import { BudgetCategory } from './Budget';

export interface IExpenseDocument extends Omit<IExpense, '_id'>, Document {
  user: mongoose.Types.ObjectId;
  category: BudgetCategory;
}

interface IExpenseModel extends Model<IExpenseDocument> {
  // Add any static methods here if needed
}

const ExpenseSchema = new mongoose.Schema<IExpenseDocument, IExpenseModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"],
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpenseDocument, IExpenseModel>("Expense", ExpenseSchema); 