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

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Income, Expense]
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - type
 *               - amount
 *               - category
 *               - date
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.post("/", protect, addTransaction); // Add a new transaction

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.get("/", protect, getTransactions); // Get all transactions of the logged-in user

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
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
 *               type:
 *                 type: string
 *                 enum: [Income, Expense]
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Transaction not found or unauthorized
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateTransaction); // Update an existing transaction

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
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
 *         description: Transaction deleted successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Transaction not found or unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteTransaction); // Delete a transaction by the user

/**
 * @swagger
 * /api/transactions/admin:
 *   get:
 *     summary: Get all transactions (Admin only)
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
 *         description: Search text for transaction description
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         description: Filter by specific transaction ID
 *         schema:
 *           type: string
 *       - name: minAmount
 *         in: query
 *         description: Minimum transaction amount
 *         schema:
 *           type: number
 *       - name: maxAmount
 *         in: query
 *         description: Maximum transaction amount
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Start date for transaction date range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date for transaction date range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: category
 *         in: query
 *         description: Filter by category ID
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         description: Filter by transaction type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *     responses:
 *       200:
 *         description: Paginated list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
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
 *         description: Invalid transaction ID or category ID format
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/admin", protect, adminProtect, getAllTransactions); // Admin: Get all transactions

/**
 * @swagger
 * /api/transactions/admin/{id}:
 *   delete:
 *     summary: Delete any transaction (Admin only)
 *     tags: [Admin, Transactions]
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
 *         description: Transaction deleted successfully by admin
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.delete("/admin/:id", protect, adminProtect, deleteAnyTransaction); // Admin: Delete any transaction

export default router; 