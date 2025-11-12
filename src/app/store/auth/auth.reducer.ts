import { createReducer, on } from '@ngrx/store';
import * as Actions from './auth.action';
import { User } from './auth.model';
import { StorageProvider } from '../../core/services/storage/storage-provider';

export interface AuthDataState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

// Helper function to get initial state from localStorage
function getInitialStateFromStorage(): AuthDataState {
  const defaultState: AuthDataState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isAuthenticating: false,
  };

  try {
    const storedData = StorageProvider.AuthState.get();
    if (storedData) {
      const parsed = JSON.parse(storedData);
      // Validate that all required fields exist
      if (parsed.user && parsed.accessToken && parsed.refreshToken) {
        return {
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
          isAuthenticated: parsed.isAuthenticated,
          isAuthenticating: parsed.isAuthenticating,
        };
      }
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }

  return defaultState;
}

// Helper function to save state to localStorage
function saveStateToStorage(state: AuthDataState): void {
  try {
    if (state.isAuthenticated && state.user && state.accessToken && state.refreshToken) {
      StorageProvider.AuthState.set(JSON.stringify(state));
    } else {
      StorageProvider.AuthState.remove();
    }
  } catch (error) {
    console.error('Failed to save auth state to localStorage:', error);
  }
}

const initialState: AuthDataState = getInitialStateFromStorage();

export const authReducer = createReducer(
  initialState,
  on(Actions.saveIdToken, (state): AuthDataState => ({ ...state })),
  on(Actions.saveLoginData, (state, { loginData }): AuthDataState => {
    const newState: AuthDataState = {
      ...state,
      user: loginData.user,
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      isAuthenticated: true,
      isAuthenticating: false,
    };
    saveStateToStorage(newState);
    return newState;
  }),
  on(Actions.clearAuthData, (): AuthDataState => {
    StorageProvider.AuthState.remove();
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAuthenticating: false,
    };
  }),
);
