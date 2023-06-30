import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { provideI18nInlineLoader } from '@core/i18n';
import { CommonService } from 'src/app/lib/services/common.service';
import { EllipsisDirective } from 'src/app/lib/directives/ellipsis.directive';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, EllipsisDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    provideI18nInlineLoader((lang) => import(`./i18n/${lang}.json`), {
      scope: 'pages/home',
      alias: 'home',
    }),
    CommonService
  ],
})
export class HomeComponent { }
