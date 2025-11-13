import { createAction, props } from '@ngrx/store';
import * as ActionTypes from './product.actiontypes';
import { Product } from './product.model';

// Fetch all products
export const fetchProducts = createAction(ActionTypes.FETCH_PRODUCTS);

export const fetchProductsSuccess = createAction(
  ActionTypes.FETCH_PRODUCTS_SUCCESS,
  props<{ products: Product[] }>()
);

export const fetchProductsFailure = createAction(
  ActionTypes.FETCH_PRODUCTS_FAILURE,
  props<{ error: string }>()
);

// Fetch product by ID
export const fetchProductById = createAction(
  ActionTypes.FETCH_PRODUCT_BY_ID,
  props<{ productId: string }>()
);

export const fetchProductByIdSuccess = createAction(
  ActionTypes.FETCH_PRODUCT_BY_ID_SUCCESS,
  props<{ product: Product }>()
);

export const fetchProductByIdFailure = createAction(
  ActionTypes.FETCH_PRODUCT_BY_ID_FAILURE,
  props<{ error: string }>()
);

// Create product
export const createProduct = createAction(ActionTypes.CREATE_PRODUCT);

export const createProductSuccess = createAction(
  ActionTypes.CREATE_PRODUCT_SUCCESS,
  props<{ product: Product }>()
);

export const createProductFailure = createAction(
  ActionTypes.CREATE_PRODUCT_FAILURE,
  props<{ error: string }>()
);

// Update product
export const updateProduct = createAction(ActionTypes.UPDATE_PRODUCT);

export const updateProductSuccess = createAction(
  ActionTypes.UPDATE_PRODUCT_SUCCESS,
  props<{ product: Product }>()
);

export const updateCProductFailure = createAction(
  ActionTypes.UPDATE_PRODUCT_FAILURE,
  props<{ error: string }>()
);

// Delete product
export const deleteProduct = createAction(
  ActionTypes.DELETE_PRODUCT,
  props<{ productId: string }>()
);

export const deleteProductSuccess = createAction(
  ActionTypes.DELETE_PRODUCT_SUCCESS,
  props<{ productId: string }>()
);

export const deleteProductFailure = createAction(
  ActionTypes.DELETE_PRODUCT_FAILURE,
  props<{ error: string }>()
);

// Clear error
export const clearProductError = createAction(ActionTypes.CLEAR_PRODUCT_ERROR);
