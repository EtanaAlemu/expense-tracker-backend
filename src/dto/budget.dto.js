// Budget Request DTOs
class CreateBudgetRequest {
    constructor(data) {
        this.category = data.category;
        this.amount = data.amount;
        this.period = data.period; // 'monthly', 'yearly', etc.
        this.startDate = data.startDate;
        this.endDate = data.endDate;
    }
}

class UpdateBudgetRequest {
    constructor(data) {
        this.category = data.category;
        this.amount = data.amount;
        this.period = data.period;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
    }
}

// Budget Response DTOs
class BudgetResponse {
    constructor(budget) {
        this.id = budget._id;
        this.category = budget.category;
        this.amount = budget.amount;
        this.period = budget.period;
        this.startDate = budget.startDate;
        this.endDate = budget.endDate;
        this.userId = budget.userId;
        this.createdAt = budget.createdAt;
        this.updatedAt = budget.updatedAt;
    }
}

class BudgetListResponse {
    constructor(budgets, total) {
        this.budgets = budgets.map(b => new BudgetResponse(b));
        this.total = total;
    }
}

module.exports = {
    CreateBudgetRequest,
    UpdateBudgetRequest,
    BudgetResponse,
    BudgetListResponse
}; 