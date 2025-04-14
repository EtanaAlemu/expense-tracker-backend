import { Request, Response } from 'express';
import { Expense } from '../models/Expense';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../dto/expense.dto';
import mongoose from 'mongoose';

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
export const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    const query = (req.query.query as string) || '';
    const minAmount = parseFloat(req.query.minAmount as string);
    const maxAmount = parseFloat(req.query.maxAmount as string);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const category = req.query.category as string;
    const id = req.query.id as string;

    // Build search query
    const searchQuery: any = {};

    // ID filter
    if (id) {
      try {
        searchQuery._id = new mongoose.Types.ObjectId(id);
      } catch (error) {
        res.status(400).json({ 
          message: "Invalid expense ID format", 
          error: "Expense ID must be a valid MongoDB ObjectId" 
        });
        return;
      }
    }

    // Text search
    if (query) {
      searchQuery.$or = [
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Amount range filter
    if (!isNaN(minAmount) || !isNaN(maxAmount)) {
      searchQuery.amount = {};
      if (!isNaN(minAmount)) searchQuery.amount.$gte = minAmount;
      if (!isNaN(maxAmount)) searchQuery.amount.$lte = maxAmount;
    }

    // Date range filter
    if (startDate || endDate) {
      searchQuery.date = {};
      if (startDate) searchQuery.date.$gte = new Date(startDate);
      if (endDate) searchQuery.date.$lte = new Date(endDate);
    }

    // Category filter
    if (category) {
      try {
        searchQuery.category = new mongoose.Types.ObjectId(category);
      } catch (error) {
        res.status(400).json({ 
          message: "Invalid category ID format", 
          error: "Category ID must be a valid MongoDB ObjectId" 
        });
        return;
      }
    }

    // Get total count
    const totalElements = await Expense.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalElements / size);

    // Get paginated results with populated user and category
    const expenses = await Expense.find(searchQuery)
      .populate('user', 'firstName lastName email')
      .populate('category', 'name description icon color')
      .sort({ date: -1 })
      .skip(page * size)
      .limit(size);

    res.status(200).json({
      content: expenses,
      page: {
        size,
        number: page,
        totalElements,
        totalPages
      }
    });
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