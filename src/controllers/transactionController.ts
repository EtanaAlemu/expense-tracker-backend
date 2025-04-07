import { Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { CreateTransactionRequest, UpdateTransactionRequest } from '../dto/transaction.dto';

// Add a new transaction (Income/Expense)
export const addTransaction = async (req: Request<{}, {}, CreateTransactionRequest>, res: Response): Promise<void> => {
  try {
    const { type, amount, category, description, date } = req.body;

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
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get all transactions for the logged-in user
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find({ user: req.user?.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update an existing transaction
export const updateTransaction = async (req: Request<{ id: string }, {}, UpdateTransactionRequest>, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists and belongs to the logged-in user
    if (!transaction || transaction.user.toString() !== req.user?.id) {
      res.status(404).json({ message: "Transaction not found or unauthorized" });
      return;
    }

    // Update the transaction fields
    Object.assign(transaction, req.body);
    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Delete a transaction (only by the user who created it)
export const deleteTransaction = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists and belongs to the logged-in user
    if (!transaction || transaction.user.toString() !== req.user?.id) {
      res.status(404).json({ message: "Transaction not found or unauthorized" });
      return;
    }

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Admin: Get all transactions from all users
export const getAllTransactions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Admin: Delete any user's transaction
export const deleteAnyTransaction = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 