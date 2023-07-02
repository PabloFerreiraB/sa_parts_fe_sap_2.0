import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AutoDestroy } from '@utils/auto-destroy';
import { SecurityService, SessionStorageService } from '@core/services';
import { DialogService } from '@core/services/dialog/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonService } from 'src/app/lib/services/common.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingComponent } from 'src/app/lib/loading/loading.component';

@Component({
  selector: 'app-initializer',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, LoadingComponent],
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss'],
  providers: [DialogService, CommonService]
})
export class InitializerComponent implements OnInit {
  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  public commonService = inject(CommonService);
  private service = inject(SecurityService);
  private sessionStorage = inject(SessionStorageService);
  private dialogService = inject(DialogService);

  private config = {
    token: '',
    languageCode: '',
    dealerNumber: '',
  }

  public ngOnInit(): void {
    this.setConfigurations();
  }

  private setConfigurations(): void {
    this.commonService.startLoading()

    this.service.getInitial().pipe(
      takeUntil(this.destroy$),
      finalize(() => this.commonService.stopLoading())
    ).subscribe({
      next: ({ user, franchises, userPermissions, userDealers }): void => {
        console.log('[USERS]', user);
        console.log('[FRONCHISES]', franchises);
        console.log('[PERMISSIONS]', userPermissions);
        console.log('[DEALERS]', userDealers);

        // USER
        this.sessionStorage.store('user', user);

        // FRANCHISES
        const brands = franchises?.data[0]?.modules[0]?.brands;
        const valueFranchises = brands?.map((brand: { code: string }) => brand.code).join(',')
        this.sessionStorage.store('franchises', valueFranchises);

        // PERMISSIONS
        if (userPermissions.length > 0) {
          const permissions = userPermissions.map((permissionModule: { Permissions: any[] }) => {
            permissionModule.Permissions.map(permission => permission.Name.toUpperCase().trim());
          }).reduce((previousPermissions: any[], currentPermissions: string | any[]) =>
            previousPermissions
              .filter(permission => !currentPermissions?.includes(permission))
              .concat(currentPermissions)
          );

          this.sessionStorage.store('permissions', permissions);
        }

        if (this.config.token || this.config.languageCode || this.config.dealerNumber) {
          // Recuperar um valor
          this.config.token = this.sessionStorage.retrieve('token');
          this.config.languageCode = this.sessionStorage.retrieve('languageCode');
          this.config.dealerNumber = this.sessionStorage.retrieve('dealerNumber');

          // Armazenar um valor
          this.sessionStorage.store('token', this.config.token);
          this.sessionStorage.store('languageCode', this.config.languageCode);
          this.sessionStorage.store('dealerNumber', this.config.dealerNumber);

          this.service.setLanguageCode(this.config.languageCode);
        } else {
          this.sessionStorage.clearAll();
        }
      },
      error: ({ error }) => {
        this.dialogService.alert(
          error.message || 'Sistema indisponível no momento.'
        );
      },
    })
  }
}
