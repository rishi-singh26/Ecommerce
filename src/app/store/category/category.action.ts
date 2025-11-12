import { createAction, props } from '@ngrx/store';
import * as ActionTypes from './category.actiontypes';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from './category.model';

// Fetch all categories
export const fetchCategories = createAction(ActionTypes.FETCH_CATEGORIES);

export const fetchCategoriesSuccess = createAction(
  ActionTypes.FETCH_CATEGORIES_SUCCESS,
  props<{ categories: Category[] }>()
);

export const fetchCategoriesFailure = createAction(
  ActionTypes.FETCH_CATEGORIES_FAILURE,
  props<{ error: string }>()
);

// Fetch category by ID
export const fetchCategoryById = createAction(
  ActionTypes.FETCH_CATEGORY_BY_ID,
  props<{ categoryId: string }>()
);

export const fetchCategoryByIdSuccess = createAction(
  ActionTypes.FETCH_CATEGORY_BY_ID_SUCCESS,
  props<{ category: Category }>()
);

export const fetchCategoryByIdFailure = createAction(
  ActionTypes.FETCH_CATEGORY_BY_ID_FAILURE,
  props<{ error: string }>()
);

// Create category
export const createCategory = createAction(
  ActionTypes.CREATE_CATEGORY,
  props<{ categoryData: CreateCategoryRequest }>()
);

export const createCategorySuccess = createAction(
  ActionTypes.CREATE_CATEGORY_SUCCESS,
  props<{ category: Category }>()
);

export const createCategoryFailure = createAction(
  ActionTypes.CREATE_CATEGORY_FAILURE,
  props<{ error: string }>()
);

// Update category
export const updateCategory = createAction(
  ActionTypes.UPDATE_CATEGORY,
  props<{ categoryId: string; categoryData: UpdateCategoryRequest }>()
);

export const updateCategorySuccess = createAction(
  ActionTypes.UPDATE_CATEGORY_SUCCESS,
  props<{ category: Category }>()
);

export const updateCategoryFailure = createAction(
  ActionTypes.UPDATE_CATEGORY_FAILURE,
  props<{ error: string }>()
);

// Delete category
export const deleteCategory = createAction(
  ActionTypes.DELETE_CATEGORY,
  props<{ categoryId: string }>()
);

export const deleteCategorySuccess = createAction(
  ActionTypes.DELETE_CATEGORY_SUCCESS,
  props<{ categoryId: string }>()
);

export const deleteCategoryFailure = createAction(
  ActionTypes.DELETE_CATEGORY_FAILURE,
  props<{ error: string }>()
);

// Clear error
export const clearCategoryError = createAction(ActionTypes.CLEAR_CATEGORY_ERROR);
