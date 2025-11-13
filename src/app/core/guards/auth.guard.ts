import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageProvider } from '../services/storage/storage-provider';
import { JwtProvider } from '../services/jwt/jwt-provider';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService {
    private router = inject(Router);

    canActivate(): boolean {
        const authState = StorageProvider.AuthState.get();
        let isAuthenticated = false;

        if (authState) {
            try {
                const authData = JSON.parse(authState);
                if (authData?.accessToken && JwtProvider.isTokenValid(authData.accessToken)) {
                    isAuthenticated = true;
                }
            } catch (error) {
                console.error('Error parsing auth state:', error);
            }
        }

        if (isAuthenticated) {
            // If authenticated, redirect to home and block access to authentication route
            this.router.navigate(['/']);
            return false;
        }

        // If not authenticated, allow access to authentication route
        return true;
    }
}

export const authGuard: CanActivateFn = (route, state) => {
    return inject(AuthGuardService).canActivate();
};
