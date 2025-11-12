import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageProvider } from '../storage/storage-provider';
import { LoginData } from '../../../store/auth/auth.model';
import { AuthService } from '../auth/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

/**
 * Decodes a JWT token to extract the payload
 * @param token - The JWT token string
 * @returns The decoded payload object or null if invalid
 */
function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token format: expected 3 parts separated by dots');
      return null;
    }

    // Decode the payload (second part of JWT)
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Checks if a JWT token has expired
 * @param token - The JWT token string
 * @returns true if token is expired, false otherwise
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);

  if (!payload || typeof payload.exp !== 'number') {
    console.warn('Token does not contain valid expiration claim');
    return true;
  }

  // Convert exp (seconds since epoch) to milliseconds and compare with current time
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  // Add 1 minute buffer to prevent using tokens that are about to expire
  const buffer = 60 * 1000; // 1 minute in milliseconds
  return currentTime > (expirationTime - buffer);
}

/**
 * Checks if an access token is valid (not empty and not expired)
 * @param token - The access token string
 * @returns true if token is valid, false otherwise
 */
function isAccessTokenValid(token: string): boolean {
  // Check if token is empty or whitespace only
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return false;
  }

  // Check if token has expired
  if (isTokenExpired(token)) {
    console.warn('Access token has expired');
    return false;
  }

  return true;
}

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
        if (isAccessTokenValid(authState.accessToken)) {
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
