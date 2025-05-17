import { Currency, Language, Role } from "../constants/enums";
import { IUser } from "../types";

// User Request DTOs
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  currency?: Currency;
  language?: Language;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  currency?: Currency;
  language?: Language;
  image?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// User Response DTOs
export class UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  currency: Currency;
  language: Language;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: IUser) {
    this.id = user._id?.toString() || "";
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.image = user.image;
    this.currency = user.currency;
    this.language = user.language;
    this.role = user.role;
    this.isActive = user.active;
    this.isVerified = user.isVerified;
    this.createdAt = user.createdAt || new Date();
    this.updatedAt = user.updatedAt || new Date();
  }
}
