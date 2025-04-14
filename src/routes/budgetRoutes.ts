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
 * /api/budgets/admin:
 *   get:
 *     summary: Get all budgets (Admin only)
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
 *         description: Search text for budget description
 *         schema:
 *           type: string
 *       - name: id
 *         in: query
 *         description: Filter by specific budget ID
 *         schema:
 *           type: string
 *       - name: minAmount
 *         in: query
 *         description: Minimum budget amount
 *         schema:
 *           type: number
 *       - name: maxAmount
 *         in: query
 *         description: Maximum budget amount
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Start date for budget date range (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date for budget date range (YYYY-MM-DD)
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
 *         description: Paginated list of budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Budget'
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
 *         description: Invalid budget ID or category ID format
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */
router.get("/admin", protect, adminProtect, getAllBudgets);

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