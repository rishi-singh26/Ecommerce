import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryDataState } from './category.reducer';

export const selectCategoryState = createFeatureSelector<CategoryDataState>('category');

export const selectAllCategories = createSelector(
  selectCategoryState,
  (state: CategoryDataState) => state.categories
);

export const selectSelectedCategory = createSelector(
  selectCategoryState,
  (state: CategoryDataState) => state.selectedCategory
);

export const selectCategoryLoading = createSelector(
  selectCategoryState,
  (state: CategoryDataState) => state.loading
);

export const selectCategoryError = createSelector(
  selectCategoryState,
  (state: CategoryDataState) => state.error
);

export const selectCategoryById = (categoryId: string) =>
  createSelector(
    selectAllCategories,
    (categories) => categories.find((cat) => cat._id === categoryId) || null
  );

export const selectCategoriesCount = createSelector(
  selectAllCategories,
  (categories) => categories.length
);
