import mongoose, { Document, Model } from 'mongoose';
import { IBudget } from '../types';

export type BudgetCategory = 'Food' | 'Transport' | 'Entertainment' | 'Bills' | 'Shopping' | 'Other';

export interface IBudgetDocument extends Omit<IBudget, '_id'>, Document {
  user: mongoose.Types.ObjectId;
  category: BudgetCategory;
  limit: number;
  startDate: Date;
  endDate: Date;
}

interface IBudgetModel extends Model<IBudgetDocument> {
  // Add any static methods here if needed
}

const BudgetSchema = new mongoose.Schema<IBudgetDocument, IBudgetModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"],
    },
    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [1, "Budget limit must be greater than 0"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value: Date) {
          return value < this.endDate; // Start date must be before end date
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
  { timestamps: true }
);

export const Budget = mongoose.model<IBudgetDocument, IBudgetModel>("Budget", BudgetSchema); 