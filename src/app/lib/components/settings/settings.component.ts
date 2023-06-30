import { Component, inject } from '@angular/core';
import { SidenavService } from '../../components/sidenav/sidenav.service';
import { SettingsSidenavComponent } from '../sidenavs/settings-sidenav/settings-sidenav.component';

@Component({
  standalone: true,
  template: `<h1>Settings</h1>`,
})
export class SettingsComponent {
  private sidenavService = inject(SidenavService);

  ngAfterViewInit(): void {
    this.sidenavService.push(SettingsSidenavComponent);
  }

  ngOnDestroy(): void {
    this.sidenavService.pop();
  }
}
