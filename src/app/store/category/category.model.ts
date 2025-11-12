export interface Category {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  statusCode: number;
  data: Category | Category[];
  message: string;
  success: boolean;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}
