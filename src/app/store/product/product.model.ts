export interface Product {
  _id: string;
  category: string;
  description?: string;
  mainImage?: any;
  name: string;
  owner?: string;
  price?: number;
  stock?: number;
  subImages?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface GetAllProductsResp {
  statusCode: number;
  data: {
    products: Product[];
    totalProducts?: number;
    limit?: number;
    page?: number;
    totalPages?: number;
    serialNumberStartFrom?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: number | null;
    nextPage?: number | null;
  };
  message?: string;
  success: boolean;
}

export interface GetProductByIdResp {
  statusCode: number;
  data: Product;
  message: string;
  success: boolean;
}

export interface CreateProductResp extends GetProductByIdResp {}

export interface UpdateProductResp extends GetProductByIdResp {}

export interface DeleteProductResp extends GetProductByIdResp {}