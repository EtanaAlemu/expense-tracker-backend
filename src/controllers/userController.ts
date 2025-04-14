import { Request, Response } from 'express';
import { User } from '../models/User';
import { UpdateUserRequest } from '../dto/user.dto';
import mongoose from 'mongoose';


export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateUserProfile = async (req: Request<{}, {}, UpdateUserRequest>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 10;
    const query = (req.query.query as string) || '';
    const role = req.query.role as string;
    const isActive = req.query.isActive as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const id = req.query.id as string;

    // Build search query
    const searchQuery: any = {};

    // Text search
    if (query) {
      searchQuery.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ];
    }

    // User ID filter
    if (id) {
      try {
        searchQuery._id = new mongoose.Types.ObjectId(id);
      } catch (error) {
        res.status(400).json({ 
          message: "Invalid user ID format", 
          error: "User ID must be a valid MongoDB ObjectId" 
        });
        return;
      }
    }

    // Role filter
    if (role) {
      searchQuery.role = role;
    }

    // Active status filter
    if (isActive !== undefined) {
      searchQuery.isActive = isActive === 'true';
    }

    // Date range filter (for createdAt)
    if (startDate || endDate) {
      searchQuery.createdAt = {};
      if (startDate) searchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) searchQuery.createdAt.$lte = new Date(endDate);
    }

    // Get total count
    const totalElements = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalElements / size);

    // Get paginated results
    const users = await User.find(searchQuery)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(page * size)
      .limit(size);

    res.status(200).json({
      content: users,
      page: {
        size,
        number: page,
        totalElements,
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateUserRole = async (req: Request<{ id: string }, {}, { role: 'user' | 'admin' }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { role } = req.body;

    user.role = role;
    const updatedUser = await user.save();
    res.status(200).json({
      message: `User role updated to ${role}`,
      user: {
        id: updatedUser._id,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deactivateUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User account deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const activateUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Only activate if the user is currently deactivated
    if (user.isActive) {
      res.status(400).json({ message: "User is already active" });
      return;
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "User account activated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 