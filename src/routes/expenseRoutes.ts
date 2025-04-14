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

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Entertainment, Bills, Shopping, Other]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - amount
 *               - category
 *               - date
 *     responses:
 *       201:
 *         description: Expense created successfully
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.post("/", protect, addExpense);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses for the logged-in user
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.get("/", protect, getExpenses);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
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
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [Food, Transport, Entertainment, Bills, Shopping, Other]
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Expense updated successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Expense not found or unauthorized
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
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
 *         description: Expense deleted successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Expense not found or unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteExpense);

/**
 * @swagger
 * /api/expenses/admin:
 *   get:
 *     summary: Get all expenses (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (0-based)
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: size
 *         in: query
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: query
 *         in: query
 *         description: Search text for expense description
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         description: Filter by specific expense ID
 *         schema:
 *           type: string
 *       - name: minAmount
 *         in: query
 *         description: Minimum expense amount
 *         schema:
 *           type: number
 *       - name: maxAmount
 *         in: query
 *         description: Maximum expense amount
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Start date for expense date range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date for expense date range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: category
 *         in: query
 *         description: Filter by category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Expense'
 *                 page:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: integer
 *                       description: Number of items per page
 *                     number:
 *                       type: integer
 *                       description: Current page number (0-based)
 *                     totalElements:
 *                       type: integer
 *                       description: Total number of items
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *       400:
 *         description: Invalid expense ID or category ID format
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/admin", protect, adminProtect, getAllExpenses);

/**
 * @swagger
 * /api/expenses/admin/{id}:
 *   delete:
 *     summary: Delete any expense (Admin only)
 *     tags: [Admin, Expenses]
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
 *         description: Expense deleted successfully by admin
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Expense not found
 *       500:
 *         description: Server error
 */
router.delete("/admin/:id", protect, adminProtect, deleteAnyExpense); // Delete any user's expense

export default router; 