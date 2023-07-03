import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { provideI18nInlineLoader } from '@core/i18n';
import { CommonService } from 'src/app/lib/services/common.service';
import { EllipsisDirective } from 'src/app/lib/directives/ellipsis.directive';
import { AutoDestroy } from '@utils/auto-destroy';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from 'src/app/lib/loading/loading.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomTextAreaCountDirective } from 'src/app/lib/directives/custom-text-area-count.directive';
import { MatButtonModule } from '@angular/material/button';
import { ActionClickEvent, Actions, ButtonPositionEnum, Column, ColumnTypeEnum, DynamicTableModule } from 'src/app/lib/components/dynamic-table';
import { DialogService } from '@core/services/dialog/dialog.service';
import { HttpParams } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    EllipsisDirective,
    CustomTextAreaCountDirective,
    MatSnackBarModule,
    LoadingComponent,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    DynamicTableModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    provideI18nInlineLoader((lang) => import(`./i18n/${lang}.json`), {
      scope: 'pages/home',
      alias: 'home',
    }),
    {
      provide: MatDialogRef,
      useValue: {}
    },
    DialogService,
    CommonService
  ],
})
export class HomeComponent implements OnInit {
  @AutoDestroy destroy$: Subject<void> = new Subject<void>();

  public form!: FormGroup;

  private formBuilder = inject(FormBuilder);
  public commonService = inject(CommonService);
  public dialogService = inject(DialogService);

  public rows!: any[];

  public pagination: any = {
    pageIndex: 0,
    pageSize: 10,
  };

  public columns: Column[] = [
    {
      type: ColumnTypeEnum.DATA,
      name: "tipoDocumento",
      title: "Tipo de documento",
      sortColumn: "doc.tipoDocumento",
      headerAttrs: {
        class: "w-35 text-nowrap ps-4",
      },
      columnAttrs: {
        class: "overflow-detect ps-4",
      },
    },
    {
      type: ColumnTypeEnum.SLOT,
      name: "dtValidade",
      title: "Data de validade",
      sortColumn: "doc.dtValidade",
      headerAttrs: {
        class: "w-15",
      },
      columnAttrs: {
        class: "",
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: "categoriaCnh",
      title: "Categoria",
      sortColumn: "doc.categoriaCnhId",
      headerAttrs: {
        class: "w-10",
      },
      columnAttrs: {
        class: "",
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: "porteArma",
      title: "Porte de arma",
      sortColumn: "doc.porteArma",
      headerAttrs: {
        class: "w-15",
      },
      columnAttrs: {
        class: "",
      },
    },
    {
      type: ColumnTypeEnum.DATA,
      name: "status",
      title: "Registro",
      sortColumn: "doc.status",
      headerAttrs: {
        class: "w-15",
      },
      columnAttrs: {
        class: "",
      },
    },
  ];

  public actions: Actions[] = [
    {
      name: 'visualizar',
      tooltip: "Visualizar",
      icon: "remove_red_eye",
      position: ButtonPositionEnum.RIGHT,
    },
    {
      name: 'editar',
      tooltip: "Editar",
      icon: "edit",
      position: ButtonPositionEnum.RIGHT
    },
    {
      name: "delete",
      tooltip: "Excluir",
      icon: "delete_forever",
      position: ButtonPositionEnum.RIGHT
    },
    {
      name: "incluir",
      tooltip: "Cadastrar documento",
      icon: "add_circle_outline",
      position: ButtonPositionEnum.BOTTOM
    },
  ];

  ngOnInit(): void {
    this.initForm();
    this.sortData();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      nome: [null, Validators.required],
      observacao: [null, [
        Validators.required,
        Validators.maxLength(500),
        CommonService.validateText()
      ]],
    });
  }

  disable() {
    this.form.disable();
  }

  enable() {
    this.form.enable();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    }
  }

  public runAction(event: ActionClickEvent) {
    if (event.name === 'incluir') {
      console.log('[INCLUIR]', event.element);
    } else if (event.name === 'editar' || event.name === 'visualizar') {
      console.log('[EDITAR ou VISUALIZAR]', event.element);
    } else if (event.name === 'delete') {
      console.log('[DELETE]', event.element);
    }
  }

  public pageData(page: any) {
    this.pagination.pageIndex = page.pageIndex;
    this.pagination.pageSize = page.pageSize;
    this.sortData();
  }

  public sortData(sort: any = null) {
    let params = new HttpParams();

    if (sort) {
      if (sort.active !== this.pagination.pageSort) {
        this.pagination.pageSort = sort.active;
        this.pagination.pageIndex = 0;
      }

      this.pagination.pageOrder = sort.direction.toUpperCase();

      params = params.append("pageSort", this.pagination.pageSort);
      if (this.pagination.pageOrder !== "") {
        params = params.append("pageOrder", this.pagination.pageOrder);
      } else {
        params = params.append("pageOrder", "ASC");
      }
    }

    if (this.pagination) {
      params = params.append("pageSize", this.pagination.pageSize);
      params = params.append("pageStart", this.pagination.pageIndex);
    }

    this.rows = this.normalizeResponse(DATA);
    this.pagination.length = DATA.totalRecords;
    this.pagination.pageSize = DATA.pageSize;
    this.pagination.pageIndex = DATA.currentPage;

    // this.commonService.startLoading();
    // this.alunosService
    //   .getListAbas(this.alunoId, "documento", params)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     finalize(() => this.common.stopLoading())
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       this.rows = this.normalizeResponse(response);
    //       this.pagination.length = response.totalRecords;
    //       this.pagination.pageSize = response.pageSize;
    //       this.pagination.pageIndex = response.currentPage;

    //       this.dataRows.emit(this.rows);
    //       this.checkRequiredToDocuments();
    //     },
    //     error: ({ error }) => {
    //       this.dialogService.alert(error.message || "Sistema indisponível no momento.");
    //     },
    //   });
  }

  private normalizeResponse(response: any) {
    return response.content.map((a: any) => {
      return {
        alunoId: a.alunoId,
        alunoDocumentoId: a.alunoDocumentoId,
        principal: a.principal === "S" ? true : false,
        tipoDocumentoId: a.tipoDocumento?.id,
        tipoDocumento: a.tipoDocumento?.descricao,
        nrDocumento: a.nrDocumento,
        dtExpedicao: a.dtExpedicao,
        dtValidade: a.dtValidade,
        categoriaCnhId: a.categoriaCnh?.id,
        categoriaCnh: a.categoriaCnh?.description || "-",
        porteArma: a.porteArma === "S" ? "Sim" : "Não",
        status: a.status === "A" ? "Ativo" : "Inativo",
        tipoCertidaoId: a.tipoCertidaoId,
        nmCartorio: a.nmCartorio,
        descTermo: a.descTermo,
        nrFolha: a.nrFolha,
        descLivro: a.descLivro,
        observacao: a.observacao,
      };
    });
  }
}

const DATA: any = {
  content: [
    {
      alunoDocumentoId: 210,
      alunoId: 121,
      tipoDocumento: {
        id: 6,
        descricao: "Carteira de Trabalho e Previdência Social - CTPS"
      },
      tipoDocumentoId: 6,
      tipo: null,
      orgaoExpedidorId: null,
      dtExpedicao: null,
      ufId: null,
      categoriaCnh: null,
      categoriaCnhId: null,
      zonaEleitoral: null,
      secaoEleitoral: null,
      tipoCertidao: null,
      tipoCertidaoId: null,
      nmCartorio: null,
      nrFolha: null,
      descTermo: null,
      descLivro: null,
      dtValidade: "2023-06-29T03:00:00.000Z",
      condicaoId: null,
      nrDocumento: "1111111111",
      porteArma: "N",
      observacao: "TESTE TESTE",
      status: "A",
      principal: "S",
      idUsuarioCadastro: 1,
      dtCadastro: "2023-06-27T20:23:17.000Z",
      idUsuarioAtualizacao: 1,
      dtAtualizacao: "2023-06-29T19:09:22.000Z"
    },
    {
      alunoDocumentoId: 211,
      alunoId: 121,
      tipoDocumento: {
        id: 5,
        descricao: "Carteira Nacional de Habilitação - CNH"
      },
      tipoDocumentoId: 5,
      tipo: null,
      orgaoExpedidorId: null,
      dtExpedicao: null,
      ufId: null,
      categoriaCnh: {
        id: 2,
        description: "AB"
      },
      categoriaCnhId: 2,
      zonaEleitoral: null,
      secaoEleitoral: null,
      tipoCertidao: null,
      tipoCertidaoId: null,
      nmCartorio: null,
      nrFolha: null,
      descTermo: null,
      descLivro: null,
      dtValidade: "2028-06-30T03:00:00.000Z",
      condicaoId: null,
      nrDocumento: "123123123",
      porteArma: "N",
      observacao: "CATEGORIA A",
      status: "A",
      principal: "N",
      idUsuarioCadastro: 1,
      dtCadastro: "2023-06-27T20:31:52.000Z",
      idUsuarioAtualizacao: 1,
      dtAtualizacao: "2023-06-29T19:10:02.000Z"
    },
    {
      alunoDocumentoId: 210,
      alunoId: 121,
      tipoDocumento: {
        id: 6,
        descricao: "Carteira de Trabalho e Previdência Social - CTPS"
      },
      tipoDocumentoId: 6,
      tipo: null,
      orgaoExpedidorId: null,
      dtExpedicao: null,
      ufId: null,
      categoriaCnh: null,
      categoriaCnhId: null,
      zonaEleitoral: null,
      secaoEleitoral: null,
      tipoCertidao: null,
      tipoCertidaoId: null,
      nmCartorio: null,
      nrFolha: null,
      descTermo: null,
      descLivro: null,
      dtValidade: "2023-06-29T03:00:00.000Z",
      condicaoId: null,
      nrDocumento: "1111111111",
      porteArma: "N",
      observacao: "TESTE TESTE",
      status: "A",
      principal: "S",
      idUsuarioCadastro: 1,
      dtCadastro: "2023-06-27T20:23:17.000Z",
      idUsuarioAtualizacao: 1,
      dtAtualizacao: "2023-06-29T19:09:22.000Z"
    },
    {
      alunoDocumentoId: 211,
      alunoId: 121,
      tipoDocumento: {
        id: 5,
        descricao: "Carteira Nacional de Habilitação - CNH"
      },
      tipoDocumentoId: 5,
      tipo: null,
      orgaoExpedidorId: null,
      dtExpedicao: null,
      ufId: null,
      categoriaCnh: {
        id: 2,
        description: "AB"
      },
      categoriaCnhId: 2,
      zonaEleitoral: null,
      secaoEleitoral: null,
      tipoCertidao: null,
      tipoCertidaoId: null,
      nmCartorio: null,
      nrFolha: null,
      descTermo: null,
      descLivro: null,
      dtValidade: "2028-06-30T03:00:00.000Z",
      condicaoId: null,
      nrDocumento: "123123123",
      porteArma: "N",
      observacao: "CATEGORIA A",
      status: "A",
      principal: "N",
      idUsuarioCadastro: 1,
      dtCadastro: "2023-06-27T20:31:52.000Z",
      idUsuarioAtualizacao: 1,
      dtAtualizacao: "2023-06-29T19:10:02.000Z"
    },
    {
      alunoDocumentoId: 210,
      alunoId: 121,
      tipoDocumento: {
        id: 6,
        descricao: "Carteira de Trabalho e Previdência Social - CTPS"
      },
      tipoDocumentoId: 6,
      tipo: null,
      orgaoExpedidorId: null,
      dtExpedicao: null,
      ufId: null,
      categoriaCnh: null,
      categoriaCnhId: null,
      zonaEleitoral: null,
      secaoEleitoral: null,
      tipoCertidao: null,
      tipoCertidaoId: null,
      nmCartorio: null,
      nrFolha: null,
      descTermo: null,
      descLivro: null,
      dtValidade: "2023-06-29T03:00:00.000Z",
      condicaoId: null,
      nrDocumento: "1111111111",
      porteArma: "N",
      observacao: "TESTE TESTE",
      status: "A",
      principal: "S",
      idUsuarioCadastro: 1,
      dtCadastro: "2023-06-27T20:23:17.000Z",
      idUsuarioAtualizacao: 1,
      dtAtualizacao: "2023-06-29T19:09:22.000Z"
    },
    {
      alunoDocumentoId: 211,
      alunoId: 121,
      tipoDocumento: {
        id: 5,
        descricao: "Carteira Nacional de Habilitação - CNH"
      },
      tipoDocumentoId: 5,
      tipo: null,
      orgaoExpedidorId: null,
      dtExpedicao: null,
      ufId: null,
      categoriaCnh: {
        id: 2,
        description: "AB"
      },
      categoriaCnhId: 2,
      zonaEleitoral: null,
      secaoEleitoral: null,
      tipoCertidao: null,
      tipoCertidaoId: null,
      nmCartorio: null,
      nrFolha: null,
      descTermo: null,
      descLivro: null,
      dtValidade: "2028-06-30T03:00:00.000Z",
      condicaoId: null,
      nrDocumento: "123123123",
      porteArma: "N",
      observacao: "CATEGORIA A",
      status: "A",
      principal: "N",
      idUsuarioCadastro: 1,
      dtCadastro: "2023-06-27T20:31:52.000Z",
      idUsuarioAtualizacao: 1,
      dtAtualizacao: "2023-06-29T19:10:02.000Z"
    }
  ],
  totalRecords: 2,
  totalPages: 1,
  currentPage: 0,
  pageSize: 10
}

