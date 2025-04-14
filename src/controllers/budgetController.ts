import { Request, Response } from 'express';
import { Budget } from '../models/Budget';
import { CreateBudgetRequest, UpdateBudgetRequest } from '../dto/budget.dto';
import mongoose from 'mongoose';

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
    const populatedBudget = await Budget.findById(budget._id).populate('category', 'name description icon color');
    res.status(201).json(populatedBudget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get Budgets for the Logged-in User
export const getBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const budgets = await Budget.find({ user: req.user?.id }).populate('category', 'name description icon color');
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
    const populatedBudget = await Budget.findById(budget._id).populate('category', 'name description icon color');
    res.status(200).json(populatedBudget);
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
export const getAllBudgets = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    const query = (req.query.query as string) || '';
    const minLimit = parseFloat(req.query.minLimit as string);
    const maxLimit = parseFloat(req.query.maxLimit as string);
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
          message: "Invalid budget ID format", 
          error: "Budget ID must be a valid MongoDB ObjectId" 
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

    // Limit range filter
    if (!isNaN(minLimit) || !isNaN(maxLimit)) {
      searchQuery.limit = {};
      if (!isNaN(minLimit)) searchQuery.limit.$gte = minLimit;
      if (!isNaN(maxLimit)) searchQuery.limit.$lte = maxLimit;
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
    const totalElements = await Budget.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalElements / size);

    // Get paginated results with populated user and category
    const budgets = await Budget.find(searchQuery)
      .populate('user', 'firstName lastName email')
      .populate('category', 'name description icon color')
      .sort({ date: -1 })
      .skip(page * size)
      .limit(size);

    res.status(200).json({
      content: budgets,
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