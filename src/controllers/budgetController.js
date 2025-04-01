const Budget = require("../models/Budget");

// Add Budget
exports.addBudget = async (req, res) => {
  try {
    const { category, limit, startDate, endDate } = req.body;

    if (!category || !limit || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const budget = new Budget({
      user: req.user.id,
      category,
      limit,
      startDate,
      endDate,
    });

    await budget.save();
    return res.status(201).json(budget);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Budgets for the Logged-in User
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this budget" });
    }

    // Update fields
    budget.category = req.body.category || budget.category;
    budget.limit = req.body.limit || budget.limit;
    budget.startDate = req.body.startDate || budget.startDate;
    budget.endDate = req.body.endDate || budget.endDate;

    await budget.save();
    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (budget.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this budget" });
    }

    await budget.deleteOne();
    return res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Get all budgets from all users
exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("user", "name email");
    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Delete any user's budget
exports.deleteAnyBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.deleteOne();
    return res.status(200).json({ message: "Budget deleted successfully by admin" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
