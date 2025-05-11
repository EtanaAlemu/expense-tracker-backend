import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "../dto/transaction.dto";
import mongoose from "mongoose";

// Add a new transaction (Income/Expense)
export const addTransaction = async (
  req: Request<{}, {}, CreateTransactionRequest>,
  res: Response
): Promise<void> => {
  try {
    const { type, amount, category, description, date } = req.body;
    console.log();
    const transaction = new Transaction({
      user: req.user?.id,
      type,
      amount,
      category,
      description,
      date,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all transactions for the logged-in user
export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const transactions = await Transaction.find({ user: req.user?.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update an existing transaction
export const updateTransaction = async (
  req: Request<{ id: string }, {}, UpdateTransactionRequest>,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists and belongs to the logged-in user
    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    if (transaction.user.toString() !== req.user?.id) {
      res
        .status(403)
        .json({ message: "Unauthorized to update this transaction" });
      return;
    }

    // Remove user field from request body to prevent unauthorized user changes
    const { user, id, ...updateData } = req.body;

    // Validate ObjectId for category if provided
    if (updateData.category) {
      try {
        new mongoose.Types.ObjectId(updateData.category);
      } catch (error) {
        res.status(400).json({
          message: "Invalid category ID format",
          error: "Category ID must be a valid MongoDB ObjectId",
        });
        return;
      }
    }

    // Update the transaction fields
    Object.assign(transaction, updateData);
    await transaction.save();

    // Populate category and user details before sending response
    await transaction.populate([
      { path: "category", select: "name description icon color" },
      { path: "user", select: "firstName lastName email" },
    ]);

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Transaction update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a transaction (only by the user who created it)
export const deleteTransaction = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists and belongs to the logged-in user
    if (!transaction || transaction.user.toString() !== req.user?.id) {
      res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
      return;
    }

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Admin: Get all transactions from all users
export const getAllTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    const query = (req.query.query as string) || "";
    const minAmount = parseFloat(req.query.minAmount as string);
    const maxAmount = parseFloat(req.query.maxAmount as string);
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const category = req.query.category as string;
    const type = req.query.type as string;
    const id = req.query.id as string;

    // Build search query
    const searchQuery: any = {};

    // ID filter
    if (id) {
      try {
        searchQuery._id = new mongoose.Types.ObjectId(id);
      } catch (error) {
        res.status(400).json({
          message: "Invalid transaction ID format",
          error: "Transaction ID must be a valid MongoDB ObjectId",
        });
        return;
      }
    }

    // Text search
    if (query) {
      searchQuery.$or = [{ description: { $regex: query, $options: "i" } }];
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
          error: "Category ID must be a valid MongoDB ObjectId",
        });
        return;
      }
    }

    // Type filter
    if (type) {
      searchQuery.type = type;
    }

    // Get total count
    const totalElements = await Transaction.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalElements / size);

    // Get paginated results with populated user and category
    const transactions = await Transaction.find(searchQuery)
      .populate("user", "firstName lastName email")
      .populate("category", "name description icon color")
      .sort({ date: -1 })
      .skip(page * size)
      .limit(size);

    res.status(200).json({
      content: transactions,
      page: {
        size,
        number: page,
        totalElements,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Admin: Delete any user's transaction
export const deleteAnyTransaction = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    await transaction.deleteOne();
    res
      .status(200)
      .json({ message: "Transaction deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
