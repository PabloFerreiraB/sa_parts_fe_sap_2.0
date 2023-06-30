import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { provideI18nInlineLoader } from '@core/i18n';
import { CommonService } from 'src/app/lib/services/common.service';
import { EllipsisDirective } from 'src/app/lib/directives/ellipsis.directive';
import { AutoDestroy } from '@utils/auto-destroy';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from 'src/app/lib/loading/loading.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomTextAreaCountDirective } from 'src/app/lib/directives/custom-text-area-count.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    EllipsisDirective,
    CustomTextAreaCountDirective,
    MatSnackBarModule,
    LoadingComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
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
export class HomeComponent implements OnInit {
  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  public form!: FormGroup;
  private readonly formBuilder = inject(FormBuilder);
  public commonService = inject(CommonService);

  ngOnInit(): void {
    this.initForm();
    // this.form.disable();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      nome: ['Pablo Ferreira', Validators.required],
      observacao: [null, [
        Validators.maxLength(500),
        CommonService.validateText()
      ]],
    });
  }
}
