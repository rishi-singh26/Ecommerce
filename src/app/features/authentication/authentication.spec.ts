import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Authentication } from './authentication';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginResponse } from '../../store/auth/auth.model';

describe('Authentication', () => {
  let component: Authentication;
  let fixture: ComponentFixture<Authentication>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockLoginResponse: LoginResponse = {
    statusCode: 200,
    data: {
      user: {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER',
        avatar: {
          url: 'https://example.com/avatar.jpg',
          localPath: '/avatars/avatar.jpg',
          _id: 'avatar123',
        },
        loginType: 'local',
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      accessToken: 'access_token_123',
      refreshToken: 'refresh_token_123',
    },
    message: "User logged in successfully",
    success: true
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register', 'logout']);

    await TestBed.configureTestingModule({
      imports: [Authentication],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Authentication);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with login mode', () => {
      expect((component as any).mode).toBe('login');
    });

    it('should initialize loading as false', () => {
      expect((component as any).loading).toBeFalsy();
    });

    it('should initialize error and success as null', () => {
      expect((component as any).error).toBeNull();
      expect((component as any).success).toBeNull();
    });

    it('should initialize login model with empty credentials', () => {
      expect((component as any).loginModel).toEqual({
        username: '',
        password: '',
      });
    });

    it('should initialize register model with default role', () => {
      expect((component as any).registerModel).toEqual({
        username: '',
        email: '',
        password: '',
        role: 'USER',
      });
    });
  });

  describe('toggleMode', () => {
    it('should toggle mode from login to register', () => {
      (component as any).mode = 'login';
      (component as any).toggleMode('register');
      expect((component as any).mode).toBe('register');
    });

    it('should toggle mode from register to login', () => {
      (component as any).mode = 'register';
      (component as any).toggleMode('login');
      expect((component as any).mode).toBe('login');
    });

    it('should clear error when toggling mode', () => {
      (component as any).error = 'Some error';
      (component as any).toggleMode('register');
      expect((component as any).error).toBeNull();
    });

    it('should clear success when toggling mode', () => {
      (component as any).success = 'Some success message';
      (component as any).toggleMode('login');
      expect((component as any).success).toBeNull();
    });
  });

  describe('submitLogin', () => {
    it('should validate username is required', () => {
      (component as any).loginModel = { username: '', password: 'password' };
      (component as any).submitLogin();
      expect((component as any).error).toBe('Please enter username and password.');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should validate password is required', () => {
      (component as any).loginModel = { username: 'user', password: '' };
      (component as any).submitLogin();
      expect((component as any).error).toBe('Please enter username and password.');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should trim whitespace from username', () => {
      (component as any).loginModel = { username: '   ', password: 'password' };
      (component as any).submitLogin();
      expect((component as any).error).toBe('Please enter username and password.');
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with credentials when valid', () => {
      const credentials = { username: 'testuser', password: 'password123' };
      (component as any).loginModel = credentials;
      authService.login.and.returnValue(of(mockLoginResponse));

      (component as any).submitLogin();

      expect(authService.login).toHaveBeenCalledWith(credentials);
    });

    it('should set loading to true when submitting login', () => {
      (component as any).loginModel = { username: 'testuser', password: 'password123' };
      authService.login.and.returnValue(of(mockLoginResponse));

      expect((component as any).loading).toBeFalsy();
      (component as any).submitLogin();
      expect((component as any).loading).toBeTruthy();
    });

    it('should set success message on successful login', (done) => {
      (component as any).loginModel = { username: 'testuser', password: 'password123' };
      authService.login.and.returnValue(of(mockLoginResponse));

      (component as any).submitLogin();

      setTimeout(() => {
        expect((component as any).success).toBe('Login successful.');
        done();
      }, 0);
    });

    it('should set loading to false on successful login', (done) => {
      (component as any).loginModel = { username: 'testuser', password: 'password123' };
      authService.login.and.returnValue(of(mockLoginResponse));

      (component as any).submitLogin();

      setTimeout(() => {
        expect((component as any).loading).toBeFalsy();
        done();
      }, 0);
    });

    it('should handle login error with error message', (done) => {
      (component as any).loginModel = { username: 'testuser', password: 'wrongpassword' };
      const errorResponse = { error: { message: 'Invalid credentials' } };
      authService.login.and.returnValue(throwError(() => errorResponse));

      (component as any).submitLogin();

      setTimeout(() => {
        expect((component as any).error).toBe('Invalid credentials');
        done();
      }, 0);
    });

    it('should handle login error with error field', (done) => {
      (component as any).loginModel = { username: 'testuser', password: 'wrongpassword' };
      const errorResponse = { error: { error: 'Authentication failed' } };
      authService.login.and.returnValue(throwError(() => errorResponse));

      (component as any).submitLogin();

      setTimeout(() => {
        expect((component as any).error).toBe('Authentication failed');
        done();
      }, 0);
    });

    it('should use generic error message when error details not provided', (done) => {
      (component as any).loginModel = { username: 'testuser', password: 'password123' };
      authService.login.and.returnValue(throwError(() => ({})));

      (component as any).submitLogin();

      setTimeout(() => {
        expect((component as any).error).toBe('Login failed');
        done();
      }, 0);
    });

    it('should set loading to false on login error', (done) => {
      (component as any).loginModel = { username: 'testuser', password: 'password123' };
      const errorResponse = { error: { message: 'Login failed' } };
      authService.login.and.returnValue(throwError(() => errorResponse));

      (component as any).submitLogin();

      setTimeout(() => {
        expect((component as any).loading).toBeFalsy();
        done();
      }, 0);
    });

    it('should clear error before submitting login', () => {
      (component as any).error = 'Previous error';
      (component as any).success = 'Previous success';
      (component as any).loginModel = { username: 'testuser', password: 'password123' };
      authService.login.and.returnValue(of(mockLoginResponse));

      (component as any).submitLogin();

      expect((component as any).error).toBeNull();
      expect((component as any).success).toBeNull();
    });
  });

  describe('submitRegister', () => {
    it('should validate username is required', () => {
      (component as any).registerModel = { username: '', email: 'test@example.com', password: 'password', role: 'USER' };
      (component as any).submitRegister();
      expect((component as any).error).toBe('Please complete username, email and password.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should validate email is required', () => {
      (component as any).registerModel = { username: 'user', email: '', password: 'password', role: 'USER' };
      (component as any).submitRegister();
      expect((component as any).error).toBe('Please complete username, email and password.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should validate password is required', () => {
      (component as any).registerModel = { username: 'user', email: 'test@example.com', password: '', role: 'USER' };
      (component as any).submitRegister();
      expect((component as any).error).toBe('Please complete username, email and password.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should trim whitespace from username and email', () => {
      (component as any).registerModel = { username: '   ', email: '   ', password: 'password', role: 'USER' };
      (component as any).submitRegister();
      expect((component as any).error).toBe('Please complete username, email and password.');
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('should call authService.register with user data when valid', () => {
      const userData = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      (component as any).registerModel = userData;
      authService.register.and.returnValue(of(mockLoginResponse));

      (component as any).submitRegister();

      expect(authService.register).toHaveBeenCalledWith(userData);
    });

    it('should set loading to true when submitting register', () => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      authService.register.and.returnValue(of(mockLoginResponse));

      expect((component as any).loading).toBeFalsy();
      (component as any).submitRegister();
      expect((component as any).loading).toBeTruthy();
    });

    it('should set success message on successful registration', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      authService.register.and.returnValue(of(mockLoginResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).success).toBe('Registration successful. You can now log in.');
        done();
      }, 0);
    });

    it('should prefill login username after successful registration', (done) => {
      const registerUsername = 'newuser';
      (component as any).registerModel = { username: registerUsername, email: 'new@example.com', password: 'password123', role: 'USER' };
      (component as any).loginModel = { username: '', password: '' };
      authService.register.and.returnValue(of(mockLoginResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).loginModel.username).toBe(registerUsername);
        done();
      }, 0);
    });

    it('should switch to login mode after successful registration', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      (component as any).mode = 'register';
      authService.register.and.returnValue(of(mockLoginResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).mode).toBe('login');
        done();
      }, 0);
    });

    it('should set loading to false on successful registration', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      authService.register.and.returnValue(of(mockLoginResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).loading).toBeFalsy();
        done();
      }, 0);
    });

    it('should handle registration error with error message', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      const errorResponse = { error: { message: 'User already exists' } };
      authService.register.and.returnValue(throwError(() => errorResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).error).toBe('User already exists');
        done();
      }, 0);
    });

    it('should handle registration error with error field', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      const errorResponse = { error: { error: 'Validation failed' } };
      authService.register.and.returnValue(throwError(() => errorResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).error).toBe('Validation failed');
        done();
      }, 0);
    });

    it('should use generic error message when error details not provided', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      authService.register.and.returnValue(throwError(() => ({})));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).error).toBe('Registration failed');
        done();
      }, 0);
    });

    it('should set loading to false on registration error', (done) => {
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      const errorResponse = { error: { message: 'Registration failed' } };
      authService.register.and.returnValue(throwError(() => errorResponse));

      (component as any).submitRegister();

      setTimeout(() => {
        expect((component as any).loading).toBeFalsy();
        done();
      }, 0);
    });

    it('should clear error before submitting register', () => {
      (component as any).error = 'Previous error';
      (component as any).success = 'Previous success';
      (component as any).registerModel = { username: 'newuser', email: 'new@example.com', password: 'password123', role: 'USER' };
      authService.register.and.returnValue(of(mockLoginResponse));

      (component as any).submitRegister();

      expect((component as any).error).toBeNull();
      expect((component as any).success).toBeNull();
    });
  });
});
