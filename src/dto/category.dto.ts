import { CategoryType, TransactionType, Frequency } from "../constants/enums";
import mongoose from "mongoose";

export interface CreateCategoryRequest {
  _id?: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  transactionType: TransactionType;
  description?: string;
  isRecurring?: boolean;
  frequency?: Frequency;
  defaultAmount?: number;
  isActive?: boolean;
  budget?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: CategoryType;
  transactionType?: TransactionType;
  description?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  isRecurring?: boolean;
  frequency?: Frequency;
  defaultAmount?: number;
  isActive?: boolean;
  lastProcessedDate?: Date;
  nextProcessedDate?: Date;
  budget?: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  type: CategoryType;
  transactionType: TransactionType;
  description?: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isRecurring: boolean;
  frequency?: Frequency;
  defaultAmount?: number;
  isActive: boolean;
  lastProcessedDate?: Date;
  nextProcessedDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  budget?: number;
}

export interface RecurringCategoryQuery {
  type?: CategoryType;
  isActive?: boolean;
}
