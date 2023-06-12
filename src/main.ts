import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './app/core/interceptors/http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityService, configFactory } from './app/core/services/security/security.service';

// redirectTo: '/agco/:token/:dealerNumber/:languageCode',
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./app/core/components/initializer/initializer.component')
  }
]

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      multi: true,
      deps: [SecurityService]
    },
  ]
})
  .catch(err => console.error(err));
