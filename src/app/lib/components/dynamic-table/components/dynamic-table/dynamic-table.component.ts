import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PageEvent as MaterialPageEvent } from '@angular/material/paginator';
import { MatSort, Sort as MaterialSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ColumnTemplateDefDirective } from '../../directive/column-template-def.directive';
import { ButtonPositionEnum } from '../../enum/button-position-enum';
import { ColumnTypeEnum } from '../../enum/column-type-enum';
import { TitleTypeEnum } from '../../enum/title-type-enum';
import { Actions } from '../../interfaces/actions';
import { ActionClickEvent } from '../../interfaces/actions-click-event';
import { Column } from '../../interfaces/column';
import { PageEvent } from '../../interfaces/page-event';
import { SelectionChange } from '../../interfaces/selection-change';
import { Sort } from '../../interfaces/sort';
import { ActionColumnAttr } from '../../interfaces/action-column-attr';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HeaderTemplateDefDirective } from '../../directive/header-template-def.directive';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DynamicTableComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  @ContentChildren(ColumnTemplateDefDirective)
  columnTemplateDef!: QueryList<ColumnTemplateDefDirective>;
  @ContentChildren(HeaderTemplateDefDirective)
  headerTemplateDef!: QueryList<HeaderTemplateDefDirective>;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * The columns to be displayed in the table.
   * @type {Column[]}
   */
  @Input() columns!: Column[];

  /**
   * Whether pagination is enabled for the table. Defaults to true.
   * @type {boolean}
   */
  @Input() pagination: boolean = true;

  /**
   * Whether to display the header of the table. Defaults to true.
   * @type {boolean}
   */
  @Input() header: boolean = true;

  /**
   * Whether to enable the select feature for the table. Defaults to false.
   * @type {boolean}
   */
  @Input() select: boolean = false;

  /**
   * Whether to display expanded detail for rows in the table. Defaults to false.
   * @type {boolean}
   */
  @Input() expandedDetail: boolean = false;

  /**
   * Whether the table rows are draggable. Defaults to false.
   * @type {boolean}
   */
  @Input() dragabble = false;

  /**
   * The position of the column icon for expanded detail. This is optional and can be null.
   * @type {number}
   */
  @Input() positionColumnIconExpandedDetail!: number;

  /**
   * The array of actions to be displayed in the table.
   * @type {Actions[]}
   */
  @Input() actions: Actions[] = [];

  /**
   * Hide the menu if actions array is empty in a specific row
   * @type {boolean}
   */
  @Input() hideMenuIfEmpty: boolean = false;

  /**
   * Additional configuration for the action column.
   * @type {ActionColumnAttr | null}
   */
  @Input() actionColumnAttr: ActionColumnAttr | null = null;

  /**
   * Whether to use the light theme for actions. Defaults to false.
   * @type {boolean}
   */
  @Input() actionLightTheme: boolean = false;

  /**
   * Additional attributes for the collapsed menu column. This is optional and can be null.
   * @type {{ [key: string]: any } | null}
   */
  @Input() menuCollapsedColumnAttr: { [key: string]: any } | null = null;

  /**
   * Whether to group actions into a menu. Defaults to true.
   * @type {boolean}
   */
  @Input() groupedActions: boolean = true;

  /**
   * The array of row indices to be displayed in the table.
   * @type {number[]}
   */
  @Input() rows: number[] = [];

  /**
   * The array of selected rows in the table.
   * @type {any[]}
   */
  @Input() rowsSelected!: any[];

  /**
   * The number of items to be displayed per page. Defaults to 10.
   * @type {number}
   */
  @Input() pageSize = 10;

  /**
   * The total number of elements in the table.
   * @type {number}
   */
  @Input() totalElements = 0;

  /**
   * The current page index of the table.
   * @type {number}
   */
  @Input() pageIndex = 0;

  /**
   * The function that determines whether an item can be selected. Defaults to a function that always returns true.
   * @type {(item: any, selectAll?: boolean) => boolean}
   */
  @Input() canSelectFn = (item: any, selectAll = false) => true;

  /**
   * The function that determines whether an item is disabled. Defaults to a function that always returns false.
   * @type {(item: any) => boolean}
   */
  @Input() isDisabledFn = (item: any) => false;

  /**
   * Event emitted when the page changes in the table.
   * @type {EventEmitter<PageEvent>}
   */
  @Output() pageChange = new EventEmitter<PageEvent>();

  /**
   * Event emitted when the sorting changes in the table.
   * @type {EventEmitter<Sort>}
   */
  @Output() sortChange = new EventEmitter<Sort>();

  /**
   * Event emitted when an action is clicked in the table.
   * @type {EventEmitter<ActionClickEvent>}
   */
  @Output() actionClick = new EventEmitter<ActionClickEvent>();

  /**
   * Event emitted when the selection changes in the table.
   * @type {EventEmitter<SelectionChange<any>>}
   */
  @Output() selectChange = new EventEmitter<SelectionChange<any>>();

  /**
   * Event emitted when a row is clicked to open the detail.
   * @type {EventEmitter<any>}
   */
  @Output() rowClickOpenDetail = new EventEmitter<any>();

  /**
   * Event emitted when the drop event occurs in the table.
   * @type {EventEmitter<CdkDragDrop<string[]>>}
   */
  @Output() dropChange = new EventEmitter<CdkDragDrop<string[]>>();

  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  menuIndex: number | undefined = undefined;
  detailExpanseIndex: number | undefined = undefined;

  displayedColumns!: string[];
  headers!: string[];

  labelAcaoAtualtemListaMenu: string = 'Fechar';
  rightActions: Actions[] = [];
  bottomActions: Actions[] = [];

  columnType = ColumnTypeEnum;
  titleType = TitleTypeEnum;
  template = new Map<string, TemplateRef<any>>();
  headerTemplate = new Map<string, TemplateRef<any>>();

  private unsub$ = new Subject();
  private stopSelectPropagation = false;

  constructor() {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnDestroy(): void {
    this.unsub$.next(null);
    this.unsub$.complete();
  }

  ngAfterContentInit(): void {
    for (let template of this.columnTemplateDef) {
      this.template.set(template.name, template.templateRef);
    }
    for (let template of this.headerTemplateDef) {
      this.headerTemplate.set(template.name, template.templateRef);
    }
  }

  ngOnInit(): void {
    this.rightActions = this.actions.filter(
      (action) => action.position === ButtonPositionEnum.RIGHT
    );
    this.bottomActions = this.actions.filter(
      (action) => action.position === ButtonPositionEnum.BOTTOM
    );
    this.initTable();

    this.selection.changed
      .pipe(
        takeUntil(this.unsub$),
        filter(() => !this.stopSelectPropagation)
      )
      .subscribe((data) => this.selectChange.emit(data));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.initTable();
    }

    if (changes['rows']) {
      this.dataSource.data = changes['rows'].currentValue || [];

      if (this.table) {
        this.updateTable();
      }
    }

    if (changes['rowsSelected'] && changes['rowsSelected'].currentValue.length > 0) {
      this.selectRows(changes['rowsSelected'].currentValue);
    }
  }

  public selectRow(row: any, event: any) {
    if (!this.selection.isSelected(row)) {
      if (this.canSelectFn(row)) {
        this.selection.select(row);
      } else {
        event.source.checked = false;
      }
    } else {
      this.selection.deselect(row);
    }
  }

  private selectRows(indexes: number[]) {
    this.stopSelectPropagation = true;
    this.selection.clear();
    this.selection.select(
      ...this.rows.filter((value: any, index: number) =>
        indexes.includes(index)
      )
    );
    this.stopSelectPropagation = false;
  }

  private updateTable() {
    this.table.renderRows();
    //this.sort.sortChange.emit();
  }

  getActionsByPosition(position: ButtonPositionEnum) {
    return this.actions.filter((action) => (action.position = position));
  }

  initTable() {
    this.displayedColumns = this.columns.map((column) => column.name);
    if (this.expandedDetail)
      this.displayedColumns.splice(
        this.positionColumnIconExpandedDetail,
        0,
        'detail'
      );

    if (this.sort) {
      this.sort.sort({
        id: this.displayedColumns[0],
        start: 'asc',
        disableClear: false,
      });
    }

    let headers: string[] = [];

    if (this.select) headers = ['select'];

    if (this.dragabble) headers = ['dragabble'];

    headers.push(...this.displayedColumns);

    if (this.rightActions.length > 0) headers.push('actions');

    this.headers = headers;
    this.dataSource.data = this.rows || [];

    if (this.table) {
      this.updateTable();
    }
  }

  onActionClick(element: any, name: string) {
    this.actionClick.emit({
      element: element,
      name: name,
    });
    this.menuIndex = undefined;
  }

  @HostListener('document:click', ['$event'])
  private processOutsideClick(event: any) {
    // Fechar o Action ao clicar fora do elemento
    if (!event.target.className.toString().includes('mat-icon')) {
      this.menuIndex = undefined;
    }
  }

  onSortChange(event: MaterialSort) {
    this.sortChange.emit(event);
  }

  onPageChange(event: MaterialPageEvent) {
    this.pageChange.emit(event);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows(event: any) {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    if (event.checked === false) {
      this.selection.clear();
      return;
    }

    const selectable = this.dataSource.data.filter((row) =>
      this.canSelectFn(row, true)
    );

    this.selection.select(...selectable);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselecione' : 'Selecione'} tudo`;
    }
    return `${this.selection.isSelected(row) ? 'Deselecionar' : 'Selecionar'
      } linha`;
  }

  isEllipsisActive(span: any) {
    const e = span;
    return e.offsetWidth < e.scrollWidth;
  }

  toggleExpanse(i: number, event: any) {
    if (this.detailExpanseIndex === i) {
      this.detailExpanseIndex = undefined;
      return;
    }

    this.detailExpanseIndex = i;
    this.rowClickOpenDetail.emit(event);
  }

  /**
   * Handles the drop event of a draggable element.
   * Emits the `dropChange` event with the provided `event` object.
   * @param {CdkDragDrop<string[]>} event The drop event object containing information about the drag and drop.
   * @returns {void}
   */
  dropEvent(event: CdkDragDrop<string[]>): void {
    this.dropChange.emit(event);
  }
}
