import { Request, Response } from 'express';
import { Expense } from '../models/Expense';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../dto/expense.dto';

// Add an expense
export const addExpense = async (req: Request<{}, {}, CreateExpenseRequest>, res: Response): Promise<void> => {
  try {
    const { amount, category, description, date } = req.body;
    
    // Create new expense
    const expense = new Expense({ 
      user: req.user?.id, 
      amount, 
      category, 
      description, 
      date 
    });
    
    // Save the expense and return the result
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get all expenses for the logged-in user
export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await Expense.find({ user: req.user?.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update an existing expense
export const updateExpense = async (req: Request<{ id: string }, {}, UpdateExpenseRequest>, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    // Ensure expense exists and belongs to the logged-in user
    if (!expense || expense.user.toString() !== req.user?.id) {
      res.status(404).json({ message: "Expense not found or unauthorized" });
      return;
    }

    // Update the expense details
    Object.assign(expense, req.body);
    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Delete an expense (logged-in user can delete their own expenses)
export const deleteExpense = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    // Ensure expense exists and belongs to the logged-in user
    if (!expense || expense.user.toString() !== req.user?.id) {
      res.status(404).json({ message: "Expense not found or unauthorized" });
      return;
    }

    // Delete the expense
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Admin: Get all expenses from all users
export const getAllExpenses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const expenses = await Expense.find().populate("user", "name email");
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Admin: Delete any user's expense
export const deleteAnyExpense = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    // Ensure the expense exists
    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    // Delete the expense
    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 