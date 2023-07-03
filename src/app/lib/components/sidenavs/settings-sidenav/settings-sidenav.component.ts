import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidenavLinkComponent } from '../../sidenav-link/sidenav-link.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [CommonModule, SidenavLinkComponent, MatIconModule],
  template: `
    <h1>Sidenav</h1>

    <app-sidenav-link
      routerLink="/"
      [routerLinkActiveOptions]="{ exact: true }"
    >
      <mat-icon icon> arrow_back </mat-icon>

      Back
    </app-sidenav-link>

    <app-sidenav-link routerLink="/settings/idioma">
      <mat-icon icon> language </mat-icon>

      Português
    </app-sidenav-link>

    <app-sidenav-link routerLink="/settings/idioma">
      <mat-icon icon> language </mat-icon>

      Inglês
    </app-sidenav-link>

    <app-sidenav-link routerLink="/settings/idioma">
      <mat-icon icon> language </mat-icon>

      Espanhol
    </app-sidenav-link>
  `,
})
export class SettingsSidenavComponent { }
