import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    loadComponent: async () => (await import('@pages/home/home.component')).HomeComponent
  },
  {
    // path: 'home',
    path: 'agco/:token/:dealerNumber/:languageCode',
    title: 'Registrando configurações',
    loadComponent: async () => (await import('@core/components')).InitializerComponent
  },
  {
    path: 'settings',
    loadComponent: async () => (await import('./lib/components/settings/settings.component')).SettingsComponent
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
