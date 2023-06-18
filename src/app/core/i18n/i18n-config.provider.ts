import { Provider } from '@angular/core';
import { environment } from '@env/environment';
import { TRANSLOCO_CONFIG, TranslocoConfig } from '@ngneat/transloco';

export const provideI18nConfig = (): Provider => ({
  provide: TRANSLOCO_CONFIG,
  useValue: {
    prodMode: environment.production,
    availableLangs: [
      { id: 'en', label: 'English' },
      { id: 'es', label: 'Español' },
      { id: 'pt', label: 'Português' },
    ],
    reRenderOnLangChange: true,
    fallbackLang: 'en',
    defaultLang: 'pt',
    missingHandler: {
      useFallbackTranslation: true,
    },
  } as TranslocoConfig,
});
