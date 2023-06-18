import { APP_INITIALIZER, importProvidersFrom, inject } from '@angular/core';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { jwtInterceptor, serverErrorInterceptor } from '@core/interceptors';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoPersistLangModule } from '@ngneat/transloco-persist-lang';
import { provideI18nConfig, provideI18nLoader, provideI18nPersistLang } from '@core/i18n';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, serverErrorInterceptor])),
    provideI18nConfig(),
    provideI18nLoader(),
    importProvidersFrom(
      // BrowserAnimationsModule,
      TranslocoModule,
      TranslocoPersistLangModule.forRoot({
        storage: provideI18nPersistLang(),
        storageKey: 'lang',
      }),
    ),
  ]
})
  .catch(err => console.error(err));
