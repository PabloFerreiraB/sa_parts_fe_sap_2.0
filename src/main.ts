import { APP_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { jwtInterceptor, serverErrorInterceptor } from '@core/interceptors';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, serverErrorInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
  ]
})
  .catch(err => console.error(err));
