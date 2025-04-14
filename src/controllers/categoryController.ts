import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../dto/category.dto';

// Add Category
export const addCategory = async (req: Request<{}, {}, CreateCategoryRequest>, res: Response): Promise<void> => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name) {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    const category = new Category({
      name,
      description,
      icon,
      color,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get Categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Get Category by ID
export const getCategory = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Update Category
export const updateCategory = async (req: Request<{ id: string }, {}, UpdateCategoryRequest>, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Update fields
    category.name = req.body.name || category.name;
    category.description = req.body.description ?? category.description;
    category.icon = req.body.icon ?? category.icon;
    category.color = req.body.color ?? category.color;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// Delete Category
export const deleteCategory = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 