import mongoose, { Document, Schema } from "mongoose";
import { CategoryType, TransactionType, Frequency } from "../constants/enums";

export interface ICategoryDocument extends Document {
  name: string;
  type: CategoryType;
  transactionType: TransactionType;
  description?: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isRecurring: boolean;
  frequency?: Frequency;
  defaultAmount?: number;
  isActive: boolean;
  lastProcessedDate?: Date;
  nextProcessedDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  calculateNextProcessDate(): Date;
  budget?: number;
  user: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(CategoryType),
      required: [true, "Category type is required"],
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      default: TransactionType.ONE_TIME,
      required: [true, "Transaction type is required"],
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
    },
    color: {
      type: String,
      required: [true, "Category color is required"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: Object.values(Frequency),
      validate: {
        validator: function (this: ICategoryDocument, v: string): boolean {
          return !this.isRecurring || (this.isRecurring && v !== undefined);
        },
        message: "Frequency is required for recurring categories",
      },
      default: null,
    },
    defaultAmount: {
      type: Number,
      validate: {
        validator: function (this: ICategoryDocument, v: number): boolean {
          return !this.isRecurring || (this.isRecurring && v > 0);
        },
        message: "Default amount must be positive for recurring categories",
      },
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastProcessedDate: {
      type: Date,
      default: null,
    },
    nextProcessedDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function (this: ICategoryDocument) {
        return !this.isDefault;
      },
    },
    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to handle recurring category setup
categorySchema.pre("save", function (next) {
  if (this.transactionType === TransactionType.RECURRING) {
    this.isRecurring = true;
    const now = new Date();

    // Set initial dates if not set
    if (!this.lastProcessedDate) {
      this.lastProcessedDate = now;
    }

    if (!this.nextProcessedDate) {
      this.nextProcessedDate = this.calculateNextProcessDate();
    }
  } else {
    // Clear recurring fields if not recurring
    this.isRecurring = false;
    this.frequency = undefined;
    this.defaultAmount = undefined;
    this.lastProcessedDate = undefined;
    this.nextProcessedDate = undefined;
  }
  next();
});

// Method to calculate next process date
categorySchema.methods.calculateNextProcessDate = function (
  this: ICategoryDocument
): Date {
  const date = new Date(this.lastProcessedDate || new Date());
  switch (this.frequency) {
    case Frequency.DAILY:
      date.setDate(date.getDate() + 1);
      break;
    case Frequency.WEEKLY:
      date.setDate(date.getDate() + 7);
      break;
    case Frequency.MONTHLY:
      date.setMonth(date.getMonth() + 1);
      break;
    case Frequency.QUARTERLY:
      date.setMonth(date.getMonth() + 3);
      break;
    case Frequency.YEARLY:
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  return date;
};

export const Category = mongoose.model<ICategoryDocument>(
  "Category",
  categorySchema
);
