import { Request, Response } from "express";
import { Category } from "../models/Category";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  RecurringCategoryQuery,
} from "../dto/category.dto";
import { CategoryType, TransactionType, Frequency } from "../constants/enums";
import mongoose from "mongoose";

// Create a new category
export const createCategory = async (
  req: Request<{}, {}, CreateCategoryRequest>,
  res: Response
): Promise<void> => {
  try {
    const { _id, ...categoryData } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    // Check if _id is provided and is a valid MongoDB ObjectId format
    let customId: mongoose.Types.ObjectId | undefined;
    if (_id) {
      // Check if the ID matches MongoDB ObjectId format (24 hex characters)
      if (/^[0-9a-fA-F]{24}$/.test(_id)) {
        try {
          customId = new mongoose.Types.ObjectId(_id);
          // Check if category with this ID already exists
          const existingCategory = await Category.findById(customId);
          if (existingCategory) {
            // Return existing category instead of error
            res.status(200).json({
              success: true,
              data: existingCategory,
              message: "Category already exists",
            });
            return;
          }
        } catch (error) {
          // If ObjectId creation fails, continue with new category creation
          console.log("Invalid ObjectId format, creating new category");
        }
      } else {
        // If ID format is invalid, continue with new category creation
        console.log("Invalid ID format, creating new category");
      }
    }

    // Basic validation
    if (!categoryData.name) {
      res.status(400).json({
        success: false,
        error: "Name is required",
      });
      return;
    }

    if (
      !categoryData.type ||
      !Object.values(CategoryType).includes(categoryData.type)
    ) {
      res.status(400).json({
        success: false,
        error: "Valid category type is required (Income/Expense)",
        supportedTypes: Object.values(CategoryType),
      });
      return;
    }

    // Validate recurring category data
    if (categoryData.transactionType === TransactionType.RECURRING) {
      if (!categoryData.frequency) {
        res.status(400).json({
          success: false,
          error: "Frequency is required for recurring categories",
          supportedFrequencies: Object.values(Frequency),
        });
        return;
      }
      if (!categoryData.defaultAmount || categoryData.defaultAmount <= 0) {
        res.status(400).json({
          success: false,
          error: "Default amount must be positive for recurring categories",
        });
        return;
      }
    }

    const category = new Category({
      _id: customId, // Use custom ID if provided and valid
      ...categoryData,
      isDefault: isAdmin,
      createdBy: isAdmin ? undefined : userId,
      isRecurring: categoryData.transactionType === TransactionType.RECURRING,
    });

    await category.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Categories
export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";
    const { showDefault, type } = req.query;

    let query: any = {};

    if (isAdmin) {
      // Admin can see all categories
      if (showDefault === "true") {
        query.isDefault = true;
      } else if (showDefault === "false") {
        query.isDefault = false;
      }
    } else {
      // Regular users can see default categories and their own
      query.$or = [{ isDefault: true }, { createdBy: userId }];

      if (showDefault === "true") {
        query = { isDefault: true };
      } else if (showDefault === "false") {
        query = { createdBy: userId };
      }
    }

    // Add type filter if provided
    if (type && Object.values(CategoryType).includes(type as CategoryType)) {
      query.type = type;
    }

    const categories = await Category.find(query);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Category by ID
export const getCategory = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Check if user has access to this category
    if (
      !isAdmin &&
      !category.isDefault &&
      category.createdBy?.toString() !== userId
    ) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update a category
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateCategoryRequest;
    const userId = req.user?.id;

    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        error: "Category not found",
      });
      return;
    }

    // Check if user has permission to update
    if (!category.isDefault && category.createdBy.toString() !== userId) {
      res.status(403).json({
        success: false,
        error: "Not authorized to update this category",
      });
      return;
    }

    // Validate recurring category updates
    if (updateData.transactionType === TransactionType.RECURRING) {
      if (!updateData.frequency) {
        res.status(400).json({
          success: false,
          error: "Frequency is required for recurring categories",
          supportedFrequencies: Object.values(Frequency),
        });
        return;
      }
      if (!updateData.defaultAmount || updateData.defaultAmount <= 0) {
        res.status(400).json({
          success: false,
          error: "Default amount must be positive for recurring categories",
        });
        return;
      }
    }

    // Handle transition between recurring and one-time
    if (updateData.transactionType) {
      updateData.isRecurring =
        updateData.transactionType === TransactionType.RECURRING;

      // Clear recurring fields if switching to one-time
      if (updateData.transactionType === TransactionType.ONE_TIME) {
        updateData.frequency = undefined;
        updateData.defaultAmount = undefined;
        updateData.lastProcessedDate = undefined;
        updateData.nextProcessedDate = undefined;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating category",
    });
  }
};

// Delete Category
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Check if user has permission to delete this category
    if (!isAdmin && category.createdBy?.toString() !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get recurring categories
export const getRecurringCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { type, isActive } = req.query as RecurringCategoryQuery;

    const query: any = {
      createdBy: userId,
      transactionType: TransactionType.RECURRING,
    };

    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive;

    const categories = await Category.find(query);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching recurring categories",
    });
  }
};
