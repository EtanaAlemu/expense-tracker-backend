import { CategoryType } from "../models/Category";

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  type: CategoryType;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  type?: CategoryType;
}
