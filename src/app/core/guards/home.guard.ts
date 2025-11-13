import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageProvider } from '../services/storage/storage-provider';
import { JwtProvider } from '../services/jwt/jwt-provider';

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
          if (JwtProvider.isTokenValid(authData.accessToken)) {
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
}

export const homeGuard: CanActivateFn = (route, state) => {
  return inject(HomeGuardService).canActivate();
};
