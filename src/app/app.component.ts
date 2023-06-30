import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavService } from './lib/components/sidenav/sidenav.service';
import { DefaultSidenavComponent } from './lib/components/sidenavs/default-sidenav/default-sidenav.component';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './lib/components/sidenav/sidenav.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidenavComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {

  private sidenavService = inject(SidenavService);
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.sidenavService.push(DefaultSidenavComponent);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.sidenavService.pop();
  }
}
