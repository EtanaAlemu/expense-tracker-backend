const express = require("express");
const { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  deleteUser, 
  updateUserRole, 
  deactivateUser, 
  activateUser  
} = require("../controllers/userController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

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

module.exports = router;
