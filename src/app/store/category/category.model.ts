export interface Category {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryResponse {
  statusCode: number;
  data: Category;
  message: string;
  success: boolean;
}

export interface GetCategoryByIdResp {
  statusCode: number;
  data: Category;
  message: string;
  success: boolean;
}

export interface UpdateCategoryResponse {
  statusCode: number;
  data: Category;
  message: string;
  success: boolean;
}

export interface DeleteCategoryResponse {
  statusCode: number;
  data: Category;
  message: string;
  success: boolean;
}

export interface GetAllCategoriesResp {
  statusCode: number;
  data: GetAllCategoriesData;
  message: string;
  success: boolean;
}

export interface GetAllCategoriesData {
  categories: Category[];
  totalCategories: 2;
  limit: number;
  page: number;
  totalPages: number;
  serialNumberStartFrom: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}


// Create category response
// {
//   "statusCode": 200,
//   "data": {
//     "name": "Clothes",
//     "owner": "69144052006ac34ebd22fb2d",
//     "_id": "6914405e006ac34ebd22fb4d",
//     "createdAt": "2025-11-12T08:07:58.647Z",
//     "updatedAt": "2025-11-12T08:07:58.647Z",
//     "__v": 0
//   },
//   "message": "Category created successfully",
//   "success": true
// }

// {
//   "statusCode": 200,
//   "data": {
//     "categories": [
//       {
//         "_id": "6914405e006ac34ebd22fb4d",
//         "name": "Clothes",
//         "owner": "69144052006ac34ebd22fb2d",
//         "createdAt": "2025-11-12T08:07:58.647Z",
//         "updatedAt": "2025-11-12T08:07:58.647Z",
//         "__v": 0
//       },
//       {
//         "_id": "691440fe006ac34ebd22fb5f",
//         "name": "Books",
//         "owner": "69144052006ac34ebd22fb2d",
//         "createdAt": "2025-11-12T08:10:38.416Z",
//         "updatedAt": "2025-11-12T08:10:38.416Z",
//         "__v": 0
//       }
//     ],
//     "totalCategories": 2,
//     "limit": 10,
//     "page": 1,
//     "totalPages": 1,
//     "serialNumberStartFrom": 1,
//     "hasPrevPage": false,
//     "hasNextPage": false,
//     "prevPage": null,
//     "nextPage": null
//   },
//   "message": "Categories fetched successfully",
//   "success": true
// }