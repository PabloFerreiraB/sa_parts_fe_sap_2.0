import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[dynamicTableColumnDef]',
})
export class ColumnTemplateDefDirective {

  @Input('dynamicTableColumnDef') name!: string;

  constructor(
    public templateRef: TemplateRef<any>
  ) { }
}
