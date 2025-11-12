import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthDataState } from './auth/auth.reducer';

export interface AppState {
  auth: AuthDataState;
}

export const reducers: ActionReducerMap<AppState, any> = {
  auth: authReducer,
};
