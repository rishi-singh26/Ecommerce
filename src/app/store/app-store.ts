import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthDataState } from './auth/auth.reducer';
import { categoryReducer, CategoryDataState } from './category/category.reducer';

export interface AppState {
  auth: AuthDataState;
  category: CategoryDataState;
}

export const reducers: ActionReducerMap<AppState, any> = {
  auth: authReducer,
  category: categoryReducer,
};
