import { productReducer, ProdcutDataState } from './product.reducer';
import * as ProductActions from './product.action';
import { Product } from './product.model';

describe('ProductReducer', () => {
  const initialState: ProdcutDataState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
  };

  const mockProduct: Product = {
    _id: 'p1',
  } as unknown as Product;

  const mockProduct2: Product = {
    _id: 'p2',
  } as unknown as Product;

  it('should return the initial state', () => {
    const action = {} as any;
    const result = productReducer(undefined, action);
    expect(result).toEqual(initialState);
  });

  describe('fetchProducts', () => {
    it('should set loading to true and clear error', () => {
      const action = ProductActions.fetchProducts();
      const result = productReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchProductsSuccess', () => {
    it('should update products and set loading to false', () => {
      const products = [mockProduct, mockProduct2];
      const action = ProductActions.fetchProductsSuccess({ products });
      const result = productReducer(initialState, action);
      expect(result.products).toEqual(products);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchProductsFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Failed to fetch products';
      const action = ProductActions.fetchProductsFailure({ error });
      const result = productReducer(initialState, action);
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('fetchProductById', () => {
    it('should set loading to true and clear error', () => {
      const action = ProductActions.fetchProductById({ id: 'p1' } as any);
      const result = productReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchProductByIdSuccess', () => {
    it('should set selectedProduct and set loading to false', () => {
      const action = ProductActions.fetchProductByIdSuccess({ product: mockProduct });
      const result = productReducer(initialState, action);
      expect(result.selectedProduct).toEqual(mockProduct);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchProductByIdFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Failed to fetch product';
      const action = ProductActions.fetchProductByIdFailure({ error });
      const result = productReducer(initialState, action);
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('createProduct', () => {
    it('should set loading to true and clear error', () => {
      const action = ProductActions.createProduct();
      const result = productReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('createProductSuccess', () => {
    it('should add new product to the list', () => {
      const stateWithProducts = { ...initialState, products: [mockProduct] };
      const action = ProductActions.createProductSuccess({ product: mockProduct2 });
      const result = productReducer(stateWithProducts, action);
      expect(result.products).toEqual([mockProduct, mockProduct2]);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('createProductFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Create failed';
      const action = ProductActions.createProductFailure({ error });
      const result = productReducer(initialState, action);
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('updateProduct', () => {
    it('should set loading to true and clear error', () => {
      const action = ProductActions.updateProduct();
      const result = productReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('updateProductSuccess', () => {
    it('should update existing product in the list', () => {
      const updated = { ...(mockProduct as any), _id: 'p1', name: 'Updated' } as Product;
      const stateWithProducts = { ...initialState, products: [mockProduct, mockProduct2] };
      const action = ProductActions.updateProductSuccess({ product: updated });
      const result = productReducer(stateWithProducts, action);
      expect(result.products[0]).toEqual(updated);
      expect(result.products[1]).toEqual(mockProduct2);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should update selectedProduct when it matches updated product', () => {
      const updated = { ...(mockProduct as any), _id: 'p1', name: 'Updated' } as Product;
      const stateWithSelected = { ...initialState, products: [mockProduct], selectedProduct: mockProduct };
      const action = ProductActions.updateProductSuccess({ product: updated });
      const result = productReducer(stateWithSelected, action);
      expect(result.selectedProduct).toEqual(updated);
    });

    it('should keep selectedProduct when it does not match updated product', () => {
      const updated = { ...(mockProduct2 as any), _id: 'p2', name: 'Updated 2' } as Product;
      const stateWithSelected = { ...initialState, products: [mockProduct, mockProduct2], selectedProduct: mockProduct };
      const action = ProductActions.updateProductSuccess({ product: updated });
      const result = productReducer(stateWithSelected, action);
      expect(result.selectedProduct).toEqual(mockProduct);
    });
  });

  describe('updateCProductFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Update failed';
      const action = ProductActions.updateCProductFailure({ error } as any);
      const result = productReducer(initialState, action);
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('deleteProduct', () => {
    it('should set loading to true and clear error', () => {
      const action = ProductActions.deleteProduct({ productId: 'p1' } as any);
      const result = productReducer(initialState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('deleteProductSuccess', () => {
    it('should remove product from the list', () => {
      const stateWithProducts = { ...initialState, products: [mockProduct, mockProduct2] };
      const action = ProductActions.deleteProductSuccess({ productId: mockProduct._id });
      const result = productReducer(stateWithProducts, action);
      expect(result.products).toEqual([mockProduct2]);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('should clear selectedProduct when deleted product was selected', () => {
      const stateWithSelected = { ...initialState, products: [mockProduct], selectedProduct: mockProduct };
      const action = ProductActions.deleteProductSuccess({ productId: mockProduct._id });
      const result = productReducer(stateWithSelected, action);
      expect(result.selectedProduct).toBeNull();
    });
  });

  describe('deleteProductFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Delete failed';
      const action = ProductActions.deleteProductFailure({ error });
      const result = productReducer(initialState, action);
      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('clearProductError', () => {
    it('should clear error message', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = ProductActions.clearProductError();
      const result = productReducer(stateWithError, action);
      expect(result.error).toBeNull();
    });
  });
});
