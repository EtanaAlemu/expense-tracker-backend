import express from 'express';
import { protect, adminProtect } from '../middleware/authMiddleware';
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  deleteAnyTransaction,
} from '../controllers/transactionController';

const router = express.Router();

// Routes for users (only authorized users can access their own transactions)
router.post("/", protect, addTransaction); // Add a new transaction
router.get("/", protect, getTransactions); // Get all transactions of the logged-in user
router.put("/:id", protect, updateTransaction); // Update an existing transaction
router.delete("/:id", protect, deleteTransaction); // Delete a transaction by the user

// Routes for admin
router.get("/admin", protect, adminProtect, getAllTransactions); // Admin: Get all transactions
router.delete("/admin/:id", protect, adminProtect, deleteAnyTransaction); // Admin: Delete any transaction

export default router; 