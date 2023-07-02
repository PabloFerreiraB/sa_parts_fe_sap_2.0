import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dynamicTableHeaderDef]',
})
export class HeaderTemplateDefDirective {

  @Input('dynamicTableHeaderDef') name!: string;

  constructor(
    public templateRef: TemplateRef<any>
  ) { }
}
