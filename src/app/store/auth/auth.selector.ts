import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthDataState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthDataState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthDataState) => state.user
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthDataState) => state.accessToken
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state: AuthDataState) => state.refreshToken
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthDataState) => state.isAuthenticated
);

export const selectIsAuthenticating = createSelector(
  selectAuthState,
  (state: AuthDataState) => state.isAuthenticating
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email || null
);

export const selectUserRole = createSelector(
  selectUser,
  (user) => user?.role || null
);

export const selectUserId = createSelector(
  selectUser,
  (user) => user?._id || null
);

export const selectUsername = createSelector(
  selectUser,
  (user) => user?.username || null
);
