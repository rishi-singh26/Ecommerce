import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageProvider } from '../storage/storage-provider';
import { LoginData } from '../../../store/auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtProvider } from '../jwt/jwt-provider';

/**
 * HTTP Interceptor function that adds Authorization header to requests
 * when a valid access token is available in localStorage.
 * Validates token existence, format, and expiration before adding it.
 * If token is invalid or expired, logs out the user and redirects to authentication.
 * @param request - The HTTP request
 * @param next - The next handler in the interceptor chain
 * @returns Observable of the HTTP event
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Get the stored auth data from localStorage
  const authStateJson = StorageProvider.AuthState.get();

  // Only add Authorization header if auth data exists
  if (authStateJson) {
    try {
      // Parse the stored auth state
      const authState: LoginData = JSON.parse(authStateJson);

      // Check if loginData and accessToken exist
      if (authState.accessToken) {
        // Validate the access token (check if not empty and not expired)
        if (JwtProvider.isTokenValid(authState.accessToken)) {
          // Clone the request and add the Authorization header
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.accessToken}`,
            },
          });
        } else {
          // Token is invalid or expired
          console.warn('Access token is invalid or expired. Logging out user and redirecting to authentication.');
          
          // Logout the user
          authService.logout();
          
          // Redirect to authentication route
          router.navigate(['/authentication']);
        }
      }
    } catch (error) {
      // If parsing fails, log the error and continue without header
      console.error('Error parsing auth state from localStorage:', error);
    }
  }

  // Pass the request to the next handler
  return next(request).pipe(
    catchError((error) => {
      // Handle 401 Unauthorized responses
      if (error.status === 401) {
        console.warn('401 Unauthorized error received. Logging out user and redirecting to authentication.');
        
        // Logout the user
        authService.logout();
        
        // Redirect to authentication route
        router.navigate(['/authentication']);
      }
      
      // Re-throw the error to allow other error handling
      return throwError(() => error);
    })
  );
};
