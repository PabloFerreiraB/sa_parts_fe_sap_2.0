import { Routes } from '@angular/router';

export const routes: Routes = [
  // redirectTo: '/agco/:token/:dealerNumber/:languageCode',
  {
    path: 'home',
    loadComponent: async () => (await import('@core/components')).InitializerComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: async () => (await import('@pages/not-found/not-found.component')).NotFoundComponent,
  },
];
