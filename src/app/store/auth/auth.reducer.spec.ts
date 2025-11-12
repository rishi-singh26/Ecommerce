import { authReducer, AuthDataState } from './auth.reducer';
import * as Actions from './auth.action';
import { User, Avatar, LoginResponse } from './auth.model';

describe('Auth Reducer', () => {
  const mockAvatar: Avatar = {
    url: 'https://via.placeholder.com/200x200.png',
    localPath: '',
    _id: '6913f4b5ba8991baba831ae7',
  };

  const mockUser: User = {
    _id: '6913f4b5ba8991baba831ae8',
    avatar: mockAvatar,
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    loginType: 'EMAIL_PASSWORD',
    isEmailVerified: false,
    createdAt: '2025-11-12T02:45:09.293Z',
    updatedAt: '2025-11-12T02:48:20.632Z',
  };

  const mockLoginResponse: LoginResponse = {
    user: mockUser,
    accessToken: 'test-access-token-123',
    refreshToken: 'test-refresh-token-456',
  };

  const initialState: AuthDataState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isAuthenticating: false,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should return the default state when no action is provided', () => {
      const action = {} as any;
      const state = authReducer(undefined, action);
      expect(state).toEqual(initialState);
    });

    it('should load from localStorage if valid auth data exists', () => {
      // Mock localStorage with valid auth state
      const storedState = {
        user: mockUser,
        accessToken: 'stored-access-token',
        refreshToken: 'stored-refresh-token',
        isAuthenticated: true,
        isAuthenticating: false,
      };
      localStorage.setItem('auth_state', JSON.stringify(storedState));

      const action = {} as any;
      const state = authReducer(undefined, action);
      
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe('stored-access-token');
      expect(state.refreshToken).toBe('stored-refresh-token');
    });

    it('should return default state if localStorage has invalid data', () => {
      localStorage.setItem('auth_state', 'invalid-json-data');

      const action = {} as any;
      const state = authReducer(undefined, action);
      
      expect(state).toEqual(initialState);
    });

    it('should return default state if required fields are missing in localStorage', () => {
      const incompleteState = {
        user: mockUser,
        // missing accessToken and refreshToken
      };
      localStorage.setItem('auth_state', JSON.stringify(incompleteState));

      const action = {} as any;
      const state = authReducer(undefined, action);
      
      expect(state).toEqual(initialState);
    });
  });

  describe('saveIdToken Action', () => {
    it('should handle saveIdToken action without modifying other state', () => {
      const idToken = 'test-id-token';
      const action = Actions.saveIdToken(idToken);
      const state = authReducer(initialState, action);
      
      expect(state).toEqual(initialState);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('saveLoginData Action', () => {
    it('should save login data and update authentication state', () => {
      const action = Actions.saveLoginData({ loginData: mockLoginResponse });
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockLoginResponse.accessToken);
      expect(state.refreshToken).toBe(mockLoginResponse.refreshToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthenticating).toBe(false);
    });

    it('should save login data to localStorage', () => {
      const action = Actions.saveLoginData({ loginData: mockLoginResponse });
      authReducer(initialState, action);

      const storedData = localStorage.getItem('auth_state');
      expect(storedData).toBeTruthy();
      
      const parsed = JSON.parse(storedData!);
      expect(parsed.user).toEqual(mockUser);
      expect(parsed.accessToken).toBe(mockLoginResponse.accessToken);
      expect(parsed.refreshToken).toBe(mockLoginResponse.refreshToken);
    });

    it('should replace existing auth state when logging in with new user', () => {
      const existingState: AuthDataState = {
        user: mockUser,
        accessToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        isAuthenticated: true,
        isAuthenticating: false,
      };

      const newUser: User = { ...mockUser, username: 'newuser', email: 'new@example.com' };
      const newLoginResponse: LoginResponse = {
        user: newUser,
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      const action = Actions.saveLoginData({ loginData: newLoginResponse });
      const state = authReducer(existingState, action);

      expect(state.user?.username).toBe('newuser');
      expect(state.accessToken).toBe('new-access-token');
      expect(state.refreshToken).toBe('new-refresh-token');
    });
  });

  describe('clearAuthData Action', () => {
    it('should clear all authentication data', () => {
      const authenticatedState: AuthDataState = {
        user: mockUser,
        accessToken: mockLoginResponse.accessToken,
        refreshToken: mockLoginResponse.refreshToken,
        isAuthenticated: true,
        isAuthenticating: false,
      };

      const action = Actions.clearAuthData();
      const state = authReducer(authenticatedState, action);

      expect(state).toEqual(initialState);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should remove auth data from localStorage', () => {
      localStorage.setItem('auth_state', JSON.stringify(mockLoginResponse));

      const authenticatedState: AuthDataState = {
        user: mockUser,
        accessToken: mockLoginResponse.accessToken,
        refreshToken: mockLoginResponse.refreshToken,
        isAuthenticated: true,
        isAuthenticating: false,
      };

      const action = Actions.clearAuthData();
      authReducer(authenticatedState, action);

      const storedData = localStorage.getItem('auth_state');
      expect(storedData).toBeNull();
    });
  });

  describe('State Immutability', () => {
    it('should not mutate the original state on saveLoginData', () => {
      const originalState = { ...initialState };
      const action = Actions.saveLoginData({ loginData: mockLoginResponse });
      
      authReducer(initialState, action);
      
      expect(initialState).toEqual(originalState);
      expect(initialState.isAuthenticated).toBe(false);
    });

    it('should not mutate the original state on clearAuthData', () => {
      const authenticatedState: AuthDataState = {
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true,
        isAuthenticating: false,
      };
      const originalState = { ...authenticatedState };
      
      const action = Actions.clearAuthData();
      authReducer(authenticatedState, action);
      
      expect(authenticatedState).toEqual(originalState);
    });
  });

  describe('Edge Cases', () => {
    it('should handle saveLoginData with minimal user data', () => {
      const minimalUser: User = {
        _id: 'user-123',
        avatar: { url: '', localPath: '', _id: '' },
        username: 'user',
        email: 'user@test.com',
        role: 'USER',
        loginType: 'EMAIL_PASSWORD',
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const minimalLoginResponse: LoginResponse = {
        user: minimalUser,
        accessToken: 'token',
        refreshToken: 'refresh',
      };

      const action = Actions.saveLoginData({ loginData: minimalLoginResponse });
      const state = authReducer(initialState, action);

      expect(state.user?._id).toBe('user-123');
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle clearAuthData when state is already empty', () => {
      const action = Actions.clearAuthData();
      const state = authReducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it('should preserve isAuthenticating flag on login', () => {
      const stateWithAuthenticating: AuthDataState = {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isAuthenticating: true,
      };

      const action = Actions.saveLoginData({ loginData: mockLoginResponse });
      const state = authReducer(stateWithAuthenticating, action);

      expect(state.isAuthenticating).toBe(false);
    });
  });
});

