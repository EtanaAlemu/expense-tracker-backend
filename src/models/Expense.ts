import mongoose, { Document, Model } from 'mongoose';
import { IExpense } from '../types';

export interface IExpenseDocument extends Omit<IExpense, '_id'>, Document {
  user: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
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