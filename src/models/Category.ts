import mongoose, { Document, Model } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault: boolean;
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
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategoryDocument, ICategoryModel>("Category", CategorySchema); 