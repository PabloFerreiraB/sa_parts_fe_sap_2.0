import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidenavLinkComponent } from '../../sidenav-link/sidenav-link.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [CommonModule, SidenavLinkComponent, MatIconModule],
  template: `
    <app-sidenav-link routerLink="/order-entry">
      <mat-icon icon>screen_share</mat-icon>

      order-entry
    </app-sidenav-link>

    <app-sidenav-link routerLink="/settings">
      <mat-icon icon>settings</mat-icon>

      Settings
    </app-sidenav-link>`,
  styles: [``],
})
export class DefaultSidenavComponent { }
