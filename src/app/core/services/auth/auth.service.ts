import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { saveLoginData, clearAuthData } from '../../../store/auth/auth.action';
import { LoginResponse } from '../../../store/auth/auth.model';
import { BASE_URL } from '../../../shared/app-constants';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpService = inject(HttpService);
  private store = inject(Store);

  /**
   * Login user with username and password
   * @param credentials - Login credentials containing username and password
   * @returns Observable of login response
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const url = `${BASE_URL}/users/login`;
    return this.httpService.post<LoginResponse>(url, credentials).pipe(
      tap((response) => {
        // Dispatch login data to NgRx store
        this.store.dispatch(saveLoginData({ loginData: response.data }));
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  /**
   * Register a new user
   * @param userData - Registration data containing username, email, password, and optional role
   * @returns Observable of login response after successful registration
   */
  register(userData: RegisterRequest): Observable<LoginResponse> {
    const url = `${BASE_URL}/users/register`;
    return this.httpService.post<LoginResponse>(url, userData).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  /**
   * Logout the current user
   * Clears the auth state from store and local storage
   */
  logout(): void {
    this.store.dispatch(clearAuthData());
  }
}
