import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthService, LoginRequest, RegisterRequest } from './auth.service';
import { HttpService } from '../http/http.service';
import { saveLoginData, clearAuthData } from '../../../store/auth/auth.action';
import { LoginResponse, User, Avatar } from '../../../store/auth/auth.model';
import { BASE_URL } from '../../../shared/app-constants';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: MockStore;

  const mockUser: User = {
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
  };

  const mockLoginResponse: LoginResponse = {
    statusCode: 200,
    data: {
      user: mockUser,
      accessToken: 'access_token_123',
      refreshToken: 'refresh_token_123',
    },
    message: "User logged in successfully",
    success: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, HttpService, provideMockStore()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call login endpoint and return login response', () => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };
      spyOn(store, 'dispatch');

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);

      expect(store.dispatch).toHaveBeenCalledWith(
        saveLoginData({ loginData: mockLoginResponse.data })
      );
    });

    it('should set Content-Type header to application/json', () => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockLoginResponse);
    });

    it('should dispatch saveLoginData action on successful login', (done) => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };
      spyOn(store, 'dispatch');

      service.login(credentials).subscribe(() => {
        expect(store.dispatch).toHaveBeenCalledWith(
          saveLoginData({ loginData: mockLoginResponse.data })
        );
        done();
      });

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      req.flush(mockLoginResponse);
    });

    it('should handle login error', (done) => {
      const credentials: LoginRequest = { username: 'testuser', password: 'wrongpassword' };
      spyOn(console, 'error');

      service.login(credentials).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
          expect(console.error).toHaveBeenCalledWith('Login error:', error);
          done();
        }
      );

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should throw error on network failure during login', (done) => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };
      spyOn(console, 'error');

      service.login(credentials).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(0);
          expect(console.error).toHaveBeenCalledWith('Login error:', error);
          done();
        }
      );

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should include all credential fields in request body', () => {
      const credentials: LoginRequest = {
        username: 'john_doe',
        password: 'secure_password_123',
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      expect(req.request.body).toEqual(credentials);
      expect(req.request.body.username).toBe('john_doe');
      expect(req.request.body.password).toBe('secure_password_123');
      req.flush(mockLoginResponse);
    });
  });

  describe('register', () => {
    it('should call register endpoint and return login response', () => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        role: 'USER',
      };

      service.register(userData).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockLoginResponse);
    });

    it('should handle registration with minimal fields', () => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      service.register(userData).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      expect(req.request.body).toEqual(userData);
      req.flush(mockLoginResponse);
    });

    it('should set Content-Type header to application/json', () => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      service.register(userData).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockLoginResponse);
    });

    it('should not dispatch store action on successful registration', () => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      spyOn(store, 'dispatch');

      service.register(userData).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      req.flush(mockLoginResponse);

      // Store dispatch should not be called for registration
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should handle registration error', (done) => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      spyOn(console, 'error');

      service.register(userData).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(409);
          expect(console.error).toHaveBeenCalledWith('Registration error:', error);
          done();
        }
      );

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      req.flush(
        { message: 'User already exists' },
        { status: 409, statusText: 'Conflict' }
      );
    });

    it('should handle validation errors during registration', (done) => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'invalid-email',
        password: 'short',
      };
      spyOn(console, 'error');

      service.register(userData).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(400);
          expect(console.error).toHaveBeenCalledWith('Registration error:', error);
          done();
        }
      );

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      req.flush(
        { message: 'Validation failed' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should include all registration fields in request body', () => {
      const userData: RegisterRequest = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'secure_password_123',
        role: 'ADMIN',
      };

      service.register(userData).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      expect(req.request.body).toEqual(userData);
      expect(req.request.body.username).toBe('john_doe');
      expect(req.request.body.email).toBe('john@example.com');
      expect(req.request.body.password).toBe('secure_password_123');
      expect(req.request.body.role).toBe('ADMIN');
      req.flush(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should dispatch clearAuthData action', () => {
      spyOn(store, 'dispatch');

      service.logout();

      expect(store.dispatch).toHaveBeenCalledWith(clearAuthData());
    });

    it('should clear authentication state', () => {
      spyOn(store, 'dispatch');

      service.logout();

      const dispatchedAction = (store.dispatch as jasmine.Spy).calls.argsFor(0)[0];
      expect(dispatchedAction.type).toBe(clearAuthData().type);
    });
  });

  describe('Error scenarios', () => {
    it('should handle 500 server error on login', (done) => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };
      spyOn(console, 'error');

      service.login(credentials).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(500);
          done();
        }
      );

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      req.flush(
        { message: 'Internal server error' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });

    it('should handle timeout error', (done) => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };
      spyOn(console, 'error');

      service.login(credentials).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(console.error).toHaveBeenCalledWith('Login error:', error);
          done();
        }
      );

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      req.error(new ProgressEvent('Timeout'));
    });
  });

  describe('Type safety', () => {
    it('should return correctly typed LoginResponse', () => {
      const credentials: LoginRequest = { username: 'testuser', password: 'password123' };

      service.login(credentials).subscribe((response: LoginResponse) => {
        expect(response.data.user).toBeDefined();
        expect(response.data.accessToken).toBeDefined();
        expect(response.data.refreshToken).toBeDefined();
        expect(response.data.user._id).toBe('123');
        expect(response.data.user.username).toBe('testuser');
      });

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      req.flush(mockLoginResponse);
    });

    it('should accept correctly typed LoginRequest', () => {
      const credentials: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/login`);
      expect(req.request.body).toEqual(credentials);
      req.flush(mockLoginResponse);
    });

    it('should accept correctly typed RegisterRequest', () => {
      const userData: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        role: 'USER',
      };

      service.register(userData).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/users/register`);
      expect(req.request.body).toEqual(userData);
      req.flush(mockLoginResponse);
    });
  });
});
