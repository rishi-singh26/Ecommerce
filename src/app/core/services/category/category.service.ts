import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HttpService } from '../http/http.service';
import {
  fetchCategories,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  fetchCategoryById,
  fetchCategoryByIdSuccess,
  fetchCategoryByIdFailure,
  createCategory,
  createCategorySuccess,
  createCategoryFailure,
  updateCategory,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategory,
  deleteCategorySuccess,
  deleteCategoryFailure,
} from '../../../store/category/category.action';
import { CreateCategoryRequest, UpdateCategoryRequest, GetAllCategoriesResp, GetCategoryByIdResp, CreateCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse } from '../../../store/category/category.model';
import { AppState } from '../../../store/app-store';
import { catchError, of } from 'rxjs';
import { BASE_URL } from '../../../shared/app-constants';

const API_BASE_URL = `${BASE_URL}/ecommerce/categories`;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private httpService = inject(HttpService);
  private store = inject(Store<AppState>);

  /**
   * Fetch all categories
   */
  fetchCategories(): void {
    this.store.dispatch(fetchCategories());
    this.httpService
      .get<GetAllCategoriesResp>(API_BASE_URL)
      .pipe(
        catchError((error) => {
          this.store.dispatch(
            fetchCategoriesFailure({
              error: error.message || 'Failed to fetch categories',
            })
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.success) {
          const categories = Array.isArray(response.data) ? response.data : [response.data];
          this.store.dispatch(fetchCategoriesSuccess({ categories: response.data.categories }));
        }
      });
  }

  /**
   * Fetch category by ID
   * @param categoryId - The ID of the category to fetch
   */
  fetchCategoryById(categoryId: string): void {
    this.store.dispatch(fetchCategoryById({ categoryId }));
    this.httpService
      .get<GetCategoryByIdResp>(`${API_BASE_URL}/${categoryId}`)
      .pipe(
        catchError((error) => {
          this.store.dispatch(
            fetchCategoryByIdFailure({
              error: error.message || 'Failed to fetch category',
            })
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.success) {
          const category = Array.isArray(response.data) ? response.data[0] : response.data;
          this.store.dispatch(
            fetchCategoryByIdSuccess({
              category,
            })
          );
        }
      });
  }

  /**
   * Create a new category
   * @param categoryData - The category data to create
   */
  createCategory(categoryData: CreateCategoryRequest): void {
    this.store.dispatch(createCategory({ categoryData }));
    this.httpService
      .post<CreateCategoryResponse>(API_BASE_URL, categoryData)
      .pipe(
        catchError((error) => {
          this.store.dispatch(
            createCategoryFailure({
              error: error.message || 'Failed to create category',
            })
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.success) {
          const category = Array.isArray(response.data) ? response.data[0] : response.data;
          this.store.dispatch(
            createCategorySuccess({
              category,
            })
          );
        }
      });
  }

  /**
   * Update a category
   * @param categoryId - The ID of the category to update
   * @param categoryData - The updated category data
   */
  updateCategory(categoryId: string, categoryData: UpdateCategoryRequest): void {
    this.store.dispatch(updateCategory({ categoryId, categoryData }));
    this.httpService
      .patch<UpdateCategoryResponse>(`${API_BASE_URL}/${categoryId}`, categoryData)
      .pipe(
        catchError((error) => {
          this.store.dispatch(
            updateCategoryFailure({
              error: error.message || 'Failed to update category',
            })
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.success) {
          const category = Array.isArray(response.data) ? response.data[0] : response.data;
          this.store.dispatch(
            updateCategorySuccess({
              category,
            })
          );
        }
      });
  }

  /**
   * Delete a category
   * @param categoryId - The ID of the category to delete
   */
  deleteCategory(categoryId: string): void {
    this.store.dispatch(deleteCategory({ categoryId }));
    this.httpService
      .delete<DeleteCategoryResponse>(`${API_BASE_URL}/${categoryId}`)
      .pipe(
        catchError((error) => {
          this.store.dispatch(
            deleteCategoryFailure({
              error: error.message || 'Failed to delete category',
            })
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.success) {
          this.store.dispatch(
            deleteCategorySuccess({
              categoryId,
            })
          );
        }
      });
  }
}
