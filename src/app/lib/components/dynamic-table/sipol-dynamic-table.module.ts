import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ColumnTemplateDefDirective } from './directive/column-template-def.directive';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DynamicAttributesDirective } from './directive/dynamic-attributes.directive';
import { ActionFilterPipe } from './directive/action-filter.directive';
import { HeaderTemplateDefDirective } from './directive/header-template-def.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    DynamicTableComponent,
    ActionFilterPipe,
    DynamicAttributesDirective,
    ColumnTemplateDefDirective,
    HeaderTemplateDefDirective
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSortModule,
    DragDropModule
  ],
  exports: [
    ColumnTemplateDefDirective,
    HeaderTemplateDefDirective,
    DynamicTableComponent
  ]
})
export class SipolDynamicTableModule { }
