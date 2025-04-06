// Expense Request DTOs
class CreateExpenseRequest {
    constructor(data) {
        this.amount = data.amount;
        this.category = data.category;
        this.description = data.description;
        this.date = data.date;
        this.receipt = data.receipt; // URL or base64 of receipt image
    }
}

class UpdateExpenseRequest {
    constructor(data) {
        this.amount = data.amount;
        this.category = data.category;
        this.description = data.description;
        this.date = data.date;
        this.receipt = data.receipt;
    }
}

// Expense Response DTOs
class ExpenseResponse {
    constructor(expense) {
        this.id = expense._id;
        this.amount = expense.amount;
        this.category = expense.category;
        this.description = expense.description;
        this.date = expense.date;
        this.receipt = expense.receipt;
        this.userId = expense.userId;
        this.createdAt = expense.createdAt;
        this.updatedAt = expense.updatedAt;
    }
}

class ExpenseListResponse {
    constructor(expenses, total) {
        this.expenses = expenses.map(e => new ExpenseResponse(e));
        this.total = total;
    }
}

module.exports = {
    CreateExpenseRequest,
    UpdateExpenseRequest,
    ExpenseResponse,
    ExpenseListResponse
}; 