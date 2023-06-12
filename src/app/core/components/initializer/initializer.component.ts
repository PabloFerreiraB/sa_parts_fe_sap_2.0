import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityService } from '../../services/security/security.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AutoDestroy } from 'src/app/utils/auto-destroy';
import { SessionStorageService } from '../../services/sessionStorage/session-storage.service';

@Component({
  selector: 'app-initializer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './initializer.component.html',
  styleUrls: ['./initializer.component.scss']
})
export default class InitializerComponent implements OnInit {
  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  private service = inject(SecurityService);
  private sessionStorage = inject(SessionStorageService);

  private config = {
    token: '',
    languageCode: '',
    dealerNumber: '',
  }

  public ngOnInit(): void {
    this.setConfigurations();
  }

  private setConfigurations(): void {
    console.log('[InitializerComponent]');

    this.service.getInitial().pipe(
      takeUntil(this.destroy$),
      finalize(() => console.log('Carregando...'))
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
        console.log('Sistema indisponível no momento.', error.message);
      },
    })
  }
}
