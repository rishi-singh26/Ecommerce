import { createReducer, on } from '@ngrx/store';
import * as Actions from './product.action';
import { Product } from './product.model';

export interface ProdcutDataState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProdcutDataState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,
  // Fetch all products
  on(Actions.fetchProducts, (state): ProdcutDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.fetchProductsSuccess, (state, { products }): ProdcutDataState => ({
    ...state,
    products,
    loading: false,
    error: null,
  })),
  on(Actions.fetchProductsFailure, (state, { error }): ProdcutDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Fetch product by ID
  on(Actions.fetchProductById, (state): ProdcutDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.fetchProductByIdSuccess, (state, { product }): ProdcutDataState => ({
    ...state,
    selectedProduct: product,
    loading: false,
    error: null,
  })),
  on(Actions.fetchProductByIdFailure, (state, { error }): ProdcutDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Create product
  on(Actions.createProduct, (state): ProdcutDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.createProductSuccess, (state, { product }): ProdcutDataState => ({
    ...state,
    products: [...state.products, product],
    loading: false,
    error: null,
  })),
  on(Actions.createProductFailure, (state, { error }): ProdcutDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Update product
  on(Actions.updateProduct, (state): ProdcutDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.updateProductSuccess, (state, { product }): ProdcutDataState => ({
    ...state,
    products: state.products.map((p) => (p._id === product._id ? product : p)),
    selectedProduct: state.selectedProduct?._id === product._id ? product : state.selectedProduct,
    loading: false,
    error: null,
  })),
  on(Actions.updateCProductFailure, (state, { error }): ProdcutDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Delete product
  on(Actions.deleteProduct, (state): ProdcutDataState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(Actions.deleteProductSuccess, (state, { productId }): ProdcutDataState => ({
    ...state,
    products: state.products.filter((p) => p._id !== productId),
    selectedProduct: state.selectedProduct?._id === productId ? null : state.selectedProduct,
    loading: false,
    error: null,
  })),
  on(Actions.deleteProductFailure, (state, { error }): ProdcutDataState => ({
    ...state,
    loading: false,
    error,
  })),
  // Clear error
  on(Actions.clearProductError, (state): ProdcutDataState => ({
    ...state,
    error: null,
  }))
);
