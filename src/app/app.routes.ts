import { Routes } from '@angular/router';

export const routes: Routes = [
  // redirectTo: '/agco/:token/:dealerNumber/:languageCode',
  {
    path: 'home',
    loadComponent: () => import('./core/components/initializer/initializer.component')
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./core/components/initializer/initializer.component')
  },
];
