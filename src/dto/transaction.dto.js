// Transaction Request DTOs
class CreateTransactionRequest {
    constructor(data) {
        this.amount = data.amount;
        this.type = data.type; // 'income' or 'expense'
        this.category = data.category;
        this.description = data.description;
        this.date = data.date;
    }
}

class UpdateTransactionRequest {
    constructor(data) {
        this.amount = data.amount;
        this.type = data.type;
        this.category = data.category;
        this.description = data.description;
        this.date = data.date;
    }
}

// Transaction Response DTOs
class TransactionResponse {
    constructor(transaction) {
        this.id = transaction._id;
        this.amount = transaction.amount;
        this.type = transaction.type;
        this.category = transaction.category;
        this.description = transaction.description;
        this.date = transaction.date;
        this.userId = transaction.userId;
        this.createdAt = transaction.createdAt;
        this.updatedAt = transaction.updatedAt;
    }
}

class TransactionListResponse {
    constructor(transactions, total) {
        this.transactions = transactions.map(t => new TransactionResponse(t));
        this.total = total;
    }
}

module.exports = {
    CreateTransactionRequest,
    UpdateTransactionRequest,
    TransactionResponse,
    TransactionListResponse
}; 