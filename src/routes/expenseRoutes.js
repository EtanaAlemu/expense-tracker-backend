const express = require("express");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getAllExpenses, // Admin: Get all expenses
  deleteAnyExpense, // Admin: Delete any expense
} = require("../controllers/expenseController");

const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// User Routes
router.post("/", protect, addExpense);
router.get("/", protect, getExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

// Admin Routes
router.get("/admin/all", protect, adminProtect, getAllExpenses); // Get all expenses
router.delete("/admin/:id", protect, adminProtect, deleteAnyExpense); // Delete any user's expense

module.exports = router;
