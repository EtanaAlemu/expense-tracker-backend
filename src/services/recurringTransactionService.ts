import { Category, ICategoryDocument } from "../models/Category";
import { Transaction } from "../models/Transaction";
import mongoose from "mongoose";
import { CategoryType, TransactionType } from "../constants/enums";

export class RecurringTransactionService {
  static async processRecurringCategories(): Promise<void> {
    const now = new Date();

    // Find all active recurring categories that are due
    const dueCategories = await Category.find({
      transactionType: TransactionType.RECURRING,
      isActive: true,
      nextProcessedDate: { $lte: now },
    });

    for (const category of dueCategories) {
      await this.processCategory(category);
    }
  }

  private static async processCategory(
    category: ICategoryDocument
  ): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new transaction
      const transaction = new Transaction({
        user: category.createdBy,
        category: category._id,
        amount: category.defaultAmount,
        type: category.type,
        description: `Recurring ${category.name}`,
        date: new Date(),
      });

      await transaction.save({ session });

      // Update category dates
      category.lastProcessedDate = new Date();
      category.nextProcessedDate = category.calculateNextProcessDate();
      await category.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error(
        `Error processing recurring category ${category._id}:`,
        error
      );
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getRecurringCategories(query: {
    type?: CategoryType;
    isActive?: boolean;
    userId: string;
  }): Promise<ICategoryDocument[]> {
    const filter: any = {
      transactionType: TransactionType.RECURRING,
      createdBy: query.userId,
    };

    if (query.type) {
      filter.type = query.type;
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    return Category.find(filter).sort({ nextProcessedDate: 1 }).exec();
  }
}
