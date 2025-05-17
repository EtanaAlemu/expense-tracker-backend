import { IBudget } from "../types";
import mongoose from "mongoose";

// Budget Request DTOs
export interface CreateBudgetRequest {
  category: string;
  limit: number;
  startDate: Date;
  endDate: Date;
}

export interface UpdateBudgetRequest {
  category?: string;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

// Budget Response DTOs
export class BudgetResponse {
  id: string;
  category: string;
  limit: number;
  startDate: Date;
  endDate: Date;
  user: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(budget: IBudget) {
    this.id = budget._id?.toString() || "";
    this.category =
      budget.category instanceof mongoose.Types.ObjectId
        ? budget.category.toString()
        : budget.category;
    this.limit = budget.limit;
    this.startDate = budget.startDate;
    this.endDate = budget.endDate;
    this.user =
      budget.user instanceof mongoose.Types.ObjectId
        ? budget.user.toString()
        : budget.user;
    this.createdAt = budget.createdAt || new Date();
    this.updatedAt = budget.updatedAt || new Date();
  }
}

export class BudgetListResponse {
  budgets: BudgetResponse[];
  total: number;

  constructor(budgets: IBudget[], total: number) {
    this.budgets = budgets.map((b) => new BudgetResponse(b));
    this.total = total;
  }
}
