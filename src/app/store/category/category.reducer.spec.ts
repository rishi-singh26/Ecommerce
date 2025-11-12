import { categoryReducer, CategoryDataState } from './category.reducer';
import * as CategoryActions from './category.action';
import { Category } from './category.model';

describe('CategoryReducer', () => {
  const initialState: CategoryDataState = {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
  };

  const mockCategory: Category = {
    _id: '691407b18736f1d74361b3ab',
    name: 'Electronics',
    owner: '6914071f8736f1d74361b389',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockCategory2: Category = {
    _id: '691407b18736f1d74361b3ac',
    name: 'Books',
    owner: '6914071f8736f1d74361b389',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  };

  it('should return the initial state', () => {
    const action = {} as any;
    const result = categoryReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  describe('fetchCategories', () => {
    it('should set loading to true', () => {
      const action = CategoryActions.fetchCategories();
      const result = categoryReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchCategoriesSuccess', () => {
    it('should update categories and set loading to false', () => {
      const categories = [mockCategory, mockCategory2];
      const action = CategoryActions.fetchCategoriesSuccess({ categories });
      const result = categoryReducer(initialState, action);
      expect(result.categories).toEqual(categories);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchCategoriesFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Failed to fetch categories';
      const action = CategoryActions.fetchCategoriesFailure({ error });
      const result = categoryReducer(initialState, action);
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('createCategorySuccess', () => {
    it('should add new category to the list', () => {
      const stateWithCategories = { ...initialState, categories: [mockCategory] };
      const action = CategoryActions.createCategorySuccess({ category: mockCategory2 });
      const result = categoryReducer(stateWithCategories, action);
      expect(result.categories).toEqual([mockCategory, mockCategory2]);
      expect(result.loading).toBe(false);
    });
  });

  describe('updateCategorySuccess', () => {
    it('should update existing category in the list', () => {
      const stateWithCategories = { ...initialState, categories: [mockCategory, mockCategory2] };
      const updatedCategory = { ...mockCategory, name: 'Updated Electronics' };
      const action = CategoryActions.updateCategorySuccess({ category: updatedCategory });
      const result = categoryReducer(stateWithCategories, action);
      expect(result.categories[0]).toEqual(updatedCategory);
      expect(result.categories[1]).toEqual(mockCategory2);
    });
  });

  describe('deleteCategorySuccess', () => {
    it('should remove category from the list', () => {
      const stateWithCategories = { ...initialState, categories: [mockCategory, mockCategory2] };
      const action = CategoryActions.deleteCategorySuccess({ categoryId: mockCategory._id });
      const result = categoryReducer(stateWithCategories, action);
      expect(result.categories).toEqual([mockCategory2]);
    });
  });

  describe('clearCategoryError', () => {
    it('should clear error message', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = CategoryActions.clearCategoryError();
      const result = categoryReducer(stateWithError, action);
      expect(result.error).toBeNull();
    });
  });
});
