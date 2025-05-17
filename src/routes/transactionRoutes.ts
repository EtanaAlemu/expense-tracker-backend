import express from "express";
import { protect, adminProtect } from "../middleware/authMiddleware";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  deleteAnyTransaction,
} from "../controllers/transactionController";

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
 *               _id:
 *                 type: string
 *                 description: Optional custom MongoDB ObjectId
 *               type:
 *                 type: string
 *                 enum: [Income, Expense]
 *               title:
 *                 type: string
 *                 description: Transaction title
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
 *               - title
 *               - amount
 *               - category
 *               - date
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       200:
 *         description: Transaction already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *                 message:
 *                   type: string
 *                   example: Transaction already exists
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 */
router.post("/", protect, addTransaction);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.get("/", protect, getTransactions);

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
 *               title:
 *                 type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Unauthorized to update this transaction
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateTransaction);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Transaction not found or unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteTransaction);

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
 *           enum: [Income, Expense]
 *     responses:
 *       200:
 *         description: Paginated list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     page:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: integer
 *                           description: Number of items per page
 *                         number:
 *                           type: integer
 *                           description: Current page number (0-based)
 *                         totalElements:
 *                           type: integer
 *                           description: Total number of items
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *       400:
 *         description: Invalid transaction ID or category ID format
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/admin", protect, adminProtect, getAllTransactions);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transaction deleted successfully by admin
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.delete("/admin/:id", protect, adminProtect, deleteAnyTransaction);

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Transaction ID
 *         user:
 *           type: string
 *           description: User ID
 *         type:
 *           type: string
 *           enum: [Income, Expense]
 *         title:
 *           type: string
 *           description: Transaction title
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *           description: Category ID
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - type
 *         - title
 *         - amount
 *         - category
 *         - date
 */

export default router;
