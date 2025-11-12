import { createReducer, on } from '@ngrx/store';
import * as Actions from './category.action';
import { Category } from './category.model';

export interface CategoryDataState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryDataState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

export const categoryReducer = createReducer(
  initialState,
  // Fetch all categories
  on(Actions.fetchCategories, (state): CategoryDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.fetchCategoriesSuccess, (state, { categories }): CategoryDataState => ({
    ...state,
    categories,
    loading: false,
    error: null,
  })),
  on(Actions.fetchCategoriesFailure, (state, { error }): CategoryDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Fetch category by ID
  on(Actions.fetchCategoryById, (state): CategoryDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.fetchCategoryByIdSuccess, (state, { category }): CategoryDataState => ({
    ...state,
    selectedCategory: category,
    loading: false,
    error: null,
  })),
  on(Actions.fetchCategoryByIdFailure, (state, { error }): CategoryDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Create category
  on(Actions.createCategory, (state): CategoryDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.createCategorySuccess, (state, { category }): CategoryDataState => ({
    ...state,
    categories: [...state.categories, category],
    loading: false,
    error: null,
  })),
  on(Actions.createCategoryFailure, (state, { error }): CategoryDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Update category
  on(Actions.updateCategory, (state): CategoryDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.updateCategorySuccess, (state, { category }): CategoryDataState => ({
    ...state,
    categories: state.categories.map((cat) => (cat._id === category._id ? category : cat)),
    selectedCategory: state.selectedCategory?._id === category._id ? category : state.selectedCategory,
    loading: false,
    error: null,
  })),
  on(Actions.updateCategoryFailure, (state, { error }): CategoryDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Delete category
  on(Actions.deleteCategory, (state): CategoryDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.deleteCategorySuccess, (state, { categoryId }): CategoryDataState => ({
    ...state,
    categories: state.categories.filter((cat) => cat._id !== categoryId),
    selectedCategory: state.selectedCategory?._id === categoryId ? null : state.selectedCategory,
    loading: false,
    error: null,
  })),
  on(Actions.deleteCategoryFailure, (state, { error }): CategoryDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Clear error
  on(Actions.clearCategoryError, (state): CategoryDataState => ({
    ...state,
    error: null,
  }))
);
