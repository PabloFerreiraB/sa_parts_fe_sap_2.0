import { Routes } from '@angular/router';

export const routes: Routes = [
  // Componente HOME apenas para testar coisas locais antes da implementação
  // {
  //   path: 'home',
  //   title: 'Home',
  //   loadComponent: async () => (await import('@pages/home/home.component')).HomeComponent
  // },
  {
    path: 'agco/:token/:dealerNumber/:languageCode',
    title: 'Registrando configurações',
    loadComponent: async () => (await import('@core/components')).InitializerComponent
  },
  {
    path: 'order-entry',
    title: 'Entrada de pedido',
    loadComponent: async () => (await import('@pages/order-entry/order-entry.component')).OrderEntryComponent
  },
  {
    path: 'settings',
    title: 'Configurações',
    loadComponent: async () => (await import('./lib/components/settings/settings.component')).SettingsComponent
  },
  {
    path: '',
    redirectTo: '/order-entry',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: async () => (await import('@pages/not-found/not-found.component')).NotFoundComponent,
  },
];
