import { Request, Response } from "express";
import { Category, CategoryType } from "../models/Category";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../dto/category.dto";

// Add Category
export const addCategory = async (
  req: Request<{}, {}, CreateCategoryRequest>,
  res: Response
): Promise<void> => {
  try {
    const { name, description, icon, color, type } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    if (!type || !Object.values(CategoryType).includes(type)) {
      res
        .status(400)
        .json({ message: "Valid category type is required (Income/Expense)" });
      return;
    }

    const category = new Category({
      name,
      description,
      icon,
      color,
      type,
      isDefault: isAdmin,
      createdBy: isAdmin ? undefined : userId,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
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

// Update Category
export const updateCategory = async (
  req: Request<{ id: string }, {}, UpdateCategoryRequest>,
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

    // Check if user has permission to update this category
    if (!isAdmin && category.createdBy?.toString() !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // Update fields
    category.name = req.body.name || category.name;
    category.description = req.body.description ?? category.description;
    category.icon = req.body.icon ?? category.icon;
    category.color = req.body.color ?? category.color;
    category.type = req.body.type || category.type;
    category.isDefault = isAdmin;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
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
