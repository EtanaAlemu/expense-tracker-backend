import express from 'express';
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getAllExpenses, // Admin: Get all expenses
  deleteAnyExpense, // Admin: Delete any expense
} from '../controllers/expenseController';

import { protect, adminProtect } from '../middleware/authMiddleware';

const router = express.Router();

// User Routes
router.post("/", protect, addExpense);
router.get("/", protect, getExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

// Admin Routes
router.get("/admin/all", protect, adminProtect, getAllExpenses); // Get all expenses
router.delete("/admin/:id", protect, adminProtect, deleteAnyExpense); // Delete any user's expense

export default router; 