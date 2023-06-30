import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[sidenavContentArea]',
})
export class SidenavContentAreaDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
