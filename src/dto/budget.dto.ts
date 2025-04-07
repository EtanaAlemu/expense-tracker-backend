import { IBudget } from '../types';
import { BudgetCategory } from '../models/Budget';

// Budget Request DTOs
export interface CreateBudgetRequest {
    category: BudgetCategory;
    limit: number;
    startDate: Date;
    endDate: Date;
}

export interface UpdateBudgetRequest {
    category?: BudgetCategory;
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
    userId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(budget: IBudget) {
        this.id = budget._id;
        this.category = budget.category;
        this.limit = budget.limit;
        this.startDate = budget.startDate;
        this.endDate = budget.endDate;
        this.userId = budget.userId;
        this.createdAt = budget.createdAt;
        this.updatedAt = budget.updatedAt;
    }
}

export class BudgetListResponse {
    budgets: BudgetResponse[];
    total: number;

    constructor(budgets: IBudget[], total: number) {
        this.budgets = budgets.map(b => new BudgetResponse(b));
        this.total = total;
    }
} 