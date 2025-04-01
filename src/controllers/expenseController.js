const Expense = require("../models/Expense");

// Add an expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    
    // Create new expense
    const expense = new Expense({ user: req.user.id, amount, category, description, date });
    
    // Save the expense and return the result
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    // Handle any errors during saving
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all expenses for the logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    // Handle errors during fetching
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    // Ensure expense exists and belongs to the logged-in user
    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    // Update the expense details
    Object.assign(expense, req.body);
    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    // Handle errors during updating
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an expense (logged-in user can delete their own expenses)
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    // Ensure expense exists and belongs to the logged-in user
    if (!expense || expense.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    // Delete the expense
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    // Handle errors during deletion
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all expenses from all users
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("user", "name email");
    res.status(200).json(expenses);
  } catch (error) {
    // Handle errors during fetching all expenses
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Delete any user's expense
exports.deleteAnyExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    // Ensure the expense exists
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Delete the expense
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully by admin" });
  } catch (error) {
    // Handle errors during deletion by admin
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
