import { Currency, Language, Role } from "../constants/enums";
import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image?: string;
  currency: Currency;
  language: Language;
  role: Role;
  active: boolean;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransaction {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  type: "Income" | "Expense";
  title: string;
  amount: number;
  category: Types.ObjectId;
  description?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBudget {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  category: Types.ObjectId;
  limit: number;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpense {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  category: Types.ObjectId;
  description?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
