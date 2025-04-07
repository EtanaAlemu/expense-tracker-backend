import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  deactivateUser, 
  activateUser  
} from '../controllers/userController';
import { protect, adminProtect } from '../middleware/authMiddleware';

const router = express.Router();

// User Profile Routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Admin Routes
router.get("/all", protect, adminProtect, getAllUsers);
router.delete("/:id", protect, adminProtect, deleteUser);

// Admin: Update user role
router.put("/:id/role", protect, adminProtect, updateUserRole);

// Admin: Deactivate user
router.put("/:id/deactivate", protect, adminProtect, deactivateUser);

// Admin: Activate user
router.put("/:id/activate", protect, adminProtect, activateUser);

export default router; 