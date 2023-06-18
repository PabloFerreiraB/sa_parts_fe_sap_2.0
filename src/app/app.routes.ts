import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    loadComponent: async () => (await import('@pages/home/home.component')).HomeComponent
  },
  {
    path: 'agco/:token/:dealerNumber/:languageCode',
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
