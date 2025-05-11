import mongoose, { Document, Model, Types } from "mongoose";

export enum CategoryType {
  INCOME = "Income",
  EXPENSE = "Expense",
}

export interface ICategoryDocument extends Document {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  type: CategoryType;
  isDefault: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface ICategoryModel extends Model<ICategoryDocument> {
  // Add any static methods here if needed
}

const CategorySchema = new mongoose.Schema<ICategoryDocument, ICategoryModel>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(CategoryType),
      required: [true, "Category type is required"],
      default: CategoryType.EXPENSE,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategoryDocument, ICategoryModel>(
  "Category",
  CategorySchema
);
