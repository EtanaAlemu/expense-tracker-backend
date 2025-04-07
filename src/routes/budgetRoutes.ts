import express from 'express';
import {
    addBudget,
    getBudgets,
    updateBudget,
    deleteBudget,
    getAllBudgets,  // Admin: Get all budgets
    deleteAnyBudget, // Admin: Delete any budget
} from '../controllers/budgetController';
  
import { protect, adminProtect } from '../middleware/authMiddleware';
  
const router = express.Router();

/**
 * @swagger
 * /api/budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Entertainment, Bills, Shopping, Other]
 *               limit:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - category
 *               - limit
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Missing required fields or invalid date range
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.post("/", protect, addBudget);

/**
 * @swagger
 * /api/budgets:
 *   get:
 *     summary: Get all budgets for the logged-in user
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of budgets
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.get("/", protect, getBudgets);

/**
 * @swagger
 * /api/budgets/{id}:
 *   put:
 *     summary: Update a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Entertainment, Bills, Shopping, Other]
 *               limit:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized to update this budget
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateBudget);

/**
 * @swagger
 * /api/budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted successfully
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized to delete this budget
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteBudget);

/**
 * @swagger
 * /api/budgets/admin/all:
 *   get:
 *     summary: Get all budgets for all users (Admin only)
 *     tags: [Admin, Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all budgets
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/admin/all", protect, adminProtect, getAllBudgets); // Get all budgets

/**
 * @swagger
 * /api/budgets/admin/{id}:
 *   delete:
 *     summary: Delete any budget (Admin only)
 *     tags: [Admin, Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted successfully by admin
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Budget not found
 *       500:
 *         description: Server error
 */
router.delete("/admin/:id", protect, adminProtect, deleteAnyBudget); // Delete any user's budget

export default router; 