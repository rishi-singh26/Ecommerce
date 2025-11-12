import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageProvider } from '../services/storage/storage-provider';

@Injectable({
  providedIn: 'root',
})
export class HomeGuardService {
  private router = inject(Router);

  canActivate(): boolean {
    const authState = StorageProvider.AuthState.get();

    if (authState) {
      try {
        // Parse the auth state to verify it contains a valid access token
        const authData = JSON.parse(authState);
        if (authData?.accessToken) {
          // Check if the token is valid and not expired
          if (this.isTokenValid(authData.accessToken)) {
            return true;
          } else {
            console.warn('Access token has expired');
            // Clear the invalid token
            StorageProvider.AuthState.remove();
          }
        }
      } catch (error) {
        console.error('Error parsing auth state:', error);
      }
    }

    // Redirect to authentication route if no valid token found
    this.router.navigate(['/authentication']);
    return false;
  }

  /**
   * Decode JWT token and check if it's valid and not expired
   * @param token - JWT access token
   * @returns true if token is valid and not expired, false otherwise
   */
  private isTokenValid(token: string): boolean {
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format');
        return false;
      }

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));

      // Check if token has an expiration claim (exp)
      if (!payload.exp) {
        console.warn('Token does not have expiration claim');
        return true; // Allow tokens without expiration
      }

      // Convert exp from seconds to milliseconds and compare with current time
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        console.warn('Token has expired at:', new Date(expirationTime));
        return false;
      }

      // Add a buffer to check if token is about to expire (within 1 minute)
      const expirationBuffer = 60 * 1000; // 1 minute in milliseconds
      if (currentTime > expirationTime - expirationBuffer) {
        console.warn('Token is about to expire');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}

export const homeGuard: CanActivateFn = (route, state) => {
  return inject(HomeGuardService).canActivate();
};
