import { Request, Response } from 'express';
import { Budget } from '../models/Budget';
import { CreateBudgetRequest, UpdateBudgetRequest } from '../dto/budget.dto';

// Add Budget
export const addBudget = async (req: Request<{}, {}, CreateBudgetRequest>, res: Response): Promise<void> => {
  try {
    const { category, limit, startDate, endDate } = req.body;

    if (!category || !limit || !startDate || !endDate) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      res.status(400).json({ message: "Start date must be before end date" });
      return;
    }

    const budget = new Budget({
      user: req.user?.id,
      category,
      limit,
      startDate,
      endDate,
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get Budgets for the Logged-in User
export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const budgets = await Budget.find({ user: req.user?.id });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update Budget
export const updateBudget = async (req: Request<{ id: string }, {}, UpdateBudgetRequest>, res: Response): Promise<void> => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    if (budget.user.toString() !== req.user?.id) {
      res.status(403).json({ message: "Not authorized to update this budget" });
      return;
    }

    // Update fields
    budget.category = req.body.category || budget.category;
    budget.limit = req.body.limit || budget.limit;
    budget.startDate = req.body.startDate || budget.startDate;
    budget.endDate = req.body.endDate || budget.endDate;

    await budget.save();
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Delete Budget
export const deleteBudget = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    if (budget.user.toString() !== req.user?.id) {
      res.status(403).json({ message: "Not authorized to delete this budget" });
      return;
    }

    await budget.deleteOne();
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Admin: Get all budgets from all users
export const getAllBudgets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const budgets = await Budget.find().populate("user", "firstName lastName email");
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Admin: Delete any user's budget
export const deleteAnyBudget = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    await budget.deleteOne();
    res.status(200).json({ message: "Budget deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 