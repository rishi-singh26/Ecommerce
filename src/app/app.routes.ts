import { Routes } from '@angular/router';
import { homeGuard } from './core/guards/home.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    canActivate: [homeGuard],
    children: [
      {
        path: 'categories',
        loadComponent: () => import('./features/home/components/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'products',
        loadComponent: () => import('./features/home/components/products/products').then((m) => m.Products),
      },
    ],
  },
  {
    path: 'authentication',
    loadComponent: () => import('./features/authentication/authentication').then((m) => m.Authentication),
    canActivate: [authGuard],
  },
];
