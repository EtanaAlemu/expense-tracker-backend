const express = require("express");
const {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
    getAllBudgets,  // Admin: Get all budgets
    deleteAnyBudget, // Admin: Delete any budget
  } = require("../controllers/budgetController");
  
const { protect, adminProtect } = require("../middleware/authMiddleware");
  
const router = express.Router();

// User Routes
router.post("/", protect, addBudget);
router.get("/", protect, getBudgets);
router.put("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

// Admin Routes
router.get("/admin/all", protect, adminProtect, getAllBudgets); // Get all budgets
router.delete("/admin/:id", protect, adminProtect, deleteAnyBudget); // Delete any user's budget

module.exports = router;
