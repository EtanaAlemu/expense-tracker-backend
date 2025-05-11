import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserRole,
  deactivateUser,
  activateUser,
} from "../controllers/userController";
import { protect, adminProtect } from "../middleware/authMiddleware";

const router = express.Router();

// User Profile Routes
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/profile", protect, getUserProfile);
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               image:
 *                 type: string
 *                 description: Base64 encoded image (max 5MB)
 *               currency:
 *                 type: string
 *                 description: User's preferred currency
 *               language:
 *                 type: string
 *                 enum: [en, am, om]
 *                 description: User's preferred language (en=English, am=Amharic, om=Afaan Oromoo)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     language:
 *                       type: string
 *                       enum: [en, am, om]
 *       400:
 *         description: Invalid input, email already in use, or unsupported language
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 supportedLanguages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of supported languages (only included for language validation errors)
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/profile", protect, updateUserProfile);

// Admin Routes
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users (Admin only)
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
 *         description: Search text for first name, last name, or email
 *         schema:
 *           type: string
 *       - name: userId
 *         in: query
 *         description: Filter by specific user ID
 *         schema:
 *           type: string
 *       - name: role
 *         in: query
 *         description: Filter by user role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *       - name: isActive
 *         in: query
 *         description: Filter by account status
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - name: startDate
 *         in: query
 *         description: Start date for account creation (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: End date for account creation (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
 *         description: Invalid user ID format
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       500:
 *         description: Server error
 */

router.get("/", protect, adminProtect, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Admin]
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
 *         description: User deleted successfully
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.delete("/:id", protect, adminProtect, deleteUser);

// Admin: Update user role
/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Admin]
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
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *             required:
 *               - role
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/:id/role", protect, adminProtect, updateUserRole);

// Admin: Deactivate user
/**
 * @swagger
 * /api/users/{id}/deactivate:
 *   put:
 *     summary: Deactivate user (Admin only)
 *     tags: [Admin]
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
 *         description: User account deactivated
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/:id/deactivate", protect, adminProtect, deactivateUser);

// Admin: Activate user
/**
 * @swagger
 * /api/users/{id}/activate:
 *   put:
 *     summary: Activate user (Admin only)
 *     tags: [Admin]
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
 *         description: User account activated
 *       400:
 *         description: User is already active
 *       401:
 *         description: Not authorized, no token
 *       403:
 *         description: Not authorized as admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.put("/:id/activate", protect, adminProtect, activateUser);

export default router;
