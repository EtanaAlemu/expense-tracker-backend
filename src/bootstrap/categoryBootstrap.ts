import { Category } from "../models/Category";
import { CategoryType, TransactionType, Frequency } from "../constants/enums";

export const defaultCategories = [
  // Income Categories
  {
    name: "Salary",
    description: "Regular salary income",
    icon: "money",
    color: "#33FF57",
    type: CategoryType.INCOME,
    transactionType: TransactionType.RECURRING,
    frequency: Frequency.MONTHLY,
    defaultAmount: 0,
    isActive: true,
    isDefault: true,
  },
  {
    name: "Freelance",
    description: "Freelance work income",
    icon: "work",
    color: "#33FF57",
    type: CategoryType.INCOME,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },
  {
    name: "Investments",
    description: "Investment returns",
    icon: "trending_up",
    color: "#33FF57",
    type: CategoryType.INCOME,
    transactionType: TransactionType.RECURRING,
    frequency: Frequency.MONTHLY,
    defaultAmount: 0,
    isActive: true,
    isDefault: true,
  },
  {
    name: "Gifts",
    description: "Gifts and donations received",
    icon: "card_giftcard",
    color: "#33FF57",
    type: CategoryType.INCOME,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },

  // Expense Categories
  {
    name: "Food & Dining",
    description: "Food and dining expenses",
    icon: "restaurant",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },
  {
    name: "Transportation",
    description: "Transportation expenses",
    icon: "directions_car",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },
  {
    name: "Housing",
    description: "Housing and rent expenses",
    icon: "home",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.RECURRING,
    frequency: Frequency.MONTHLY,
    defaultAmount: 0,
    isActive: true,
    isDefault: true,
  },
  {
    name: "Utilities",
    description: "Utility bills",
    icon: "build",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.RECURRING,
    frequency: Frequency.MONTHLY,
    defaultAmount: 0,
    isActive: true,
    isDefault: true,
  },
  {
    name: "Shopping",
    description: "Shopping expenses",
    icon: "shopping_cart",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },
  {
    name: "Entertainment",
    description: "Entertainment expenses",
    icon: "sports_esports",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },
  {
    name: "Healthcare",
    description: "Healthcare expenses",
    icon: "local_hospital",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.ONE_TIME,
    isDefault: true,
  },
  {
    name: "Education",
    description: "Education expenses",
    icon: "school",
    color: "#FF5733",
    type: CategoryType.EXPENSE,
    transactionType: TransactionType.RECURRING,
    frequency: Frequency.MONTHLY,
    defaultAmount: 0,
    isActive: true,
    isDefault: true,
  },
];

export const bootstrapCategories = async (): Promise<void> => {
  try {
    // Check if any default categories exist
    const existingCategories = await Category.find({ isDefault: true });

    if (existingCategories.length === 0) {
      // Create default categories if none exist
      await Category.insertMany(defaultCategories);
      console.log("Default categories created successfully");
    } else {
      console.log("Default categories already exist");
    }
  } catch (error) {
    console.error("Error bootstrapping categories:", error);
    throw error;
  }
};
