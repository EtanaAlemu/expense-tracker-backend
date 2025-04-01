const Transaction = require("../models/Transaction");

// Add a new transaction (Income/Expense)
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = new Transaction({
      user: req.user.id, // Assuming you are using middleware to set user
      type,
      amount,
      category,
      description,
      date,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists and belongs to the logged-in user
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }

    // Update the transaction fields
    Object.assign(transaction, req.body);
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a transaction (only by the user who created it)
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists and belongs to the logged-in user
    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all transactions from all users
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Delete any user's transaction
exports.deleteAnyTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
