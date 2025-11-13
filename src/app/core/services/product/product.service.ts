import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { BASE_URL } from '../../../shared/app-constants';
import {
  CreateProductResp,
  DeleteProductResp,
  GetAllProductsResp,
  GetProductByIdResp,
  UpdateProductResp
} from '../../../store/product/product.model';

const API_BASE_URL = `${BASE_URL}/ecommerce/products`;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private httpService = inject(HttpService);
  private httpClient = inject(HttpClient);

  /**
   * Fetch list of products. Accepts optional query params (page, limit, search, etc.)
   */
  fetchProducts(params?: Record<string, string | number | boolean | string[]>): Observable<GetAllProductsResp> {
    return this.httpService.get<GetAllProductsResp>(API_BASE_URL, { params }).pipe(
      catchError((err) => {
        // bubble up a normalized error
        return throwError(() => err?.message || 'Failed to fetch products');
      })
    );
  }

  /**
   * Fetch a single product by id
   */
  fetchProductById(productId: string): Observable<GetProductByIdResp> {
    return this.httpService.get<GetProductByIdResp>(`${API_BASE_URL}/${productId}`).pipe(
      catchError((err) => throwError(() => err?.message || 'Failed to fetch product'))
    );
  }

  /**
   * Create a product. The API accepts multipart/form-data for images.
   * Callers can provide either a FormData instance (recommended when uploading files)
   * or a plain object for JSON-only creation.
   */
  createProduct(payload: FormData | Record<string, any>): Observable<CreateProductResp> {
    if (payload instanceof FormData) {
      // use HttpClient directly so the browser sets the correct multipart boundary header
      return this.httpClient.post<CreateProductResp>(API_BASE_URL, payload).pipe(
        catchError((err) => throwError(() => err?.message || 'Failed to create product'))
      );
    }

    // JSON body - safe to use HttpService
    return this.httpService.post<CreateProductResp>(API_BASE_URL, payload).pipe(
      catchError((err) => throwError(() => err?.message || 'Failed to create product'))
    );
  }

  /**
   * Update a product. Accepts either FormData (for files) or JSON partial data.
   */
  updateProduct(productId: string, payload: FormData | Record<string, any>): Observable<UpdateProductResp> {
    const url = `${API_BASE_URL}/${productId}`;

    if (payload instanceof FormData) {
      return this.httpClient.patch<UpdateProductResp>(url, payload).pipe(
        catchError((err) => throwError(() => err?.message || 'Failed to update product'))
      );
    }

    return this.httpService.patch<UpdateProductResp>(url, payload).pipe(
      catchError((err) => throwError(() => err?.message || 'Failed to update product'))
    );
  }

  /**
   * Delete a product by id
   */
  deleteProduct(productId: string): Observable<DeleteProductResp> {
    return this.httpService.delete<DeleteProductResp>(`${API_BASE_URL}/${productId}`).pipe(
      catchError((err) => throwError(() => err?.message || 'Failed to delete product'))
    );
  }
}
