import mongoose, { Document, Model } from "mongoose";
import { ITransaction } from "../types";

export interface ITransactionDocument
  extends Omit<ITransaction, "_id">,
    Document {
  user: mongoose.Types.ObjectId;
  type: "Income" | "Expense";
  category: mongoose.Types.ObjectId;
}

interface ITransactionModel extends Model<ITransactionDocument> {
  // Add any static methods here if needed
}

const TransactionSchema = new mongoose.Schema<
  ITransactionDocument,
  ITransactionModel
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Income", "Expense"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Transaction category is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<
  ITransactionDocument,
  ITransactionModel
>("Transaction", TransactionSchema);
