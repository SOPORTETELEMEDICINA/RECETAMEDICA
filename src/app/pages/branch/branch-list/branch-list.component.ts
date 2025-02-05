// noinspection DuplicatedCode,JSUnusedGlobalSymbols

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {fromEvent} from 'rxjs';
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter,} from '@shared';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {FeatherIconsComponent} from '@shared/components/feather-icons/feather-icons.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BreadcrumbComponent} from '@shared/components/breadcrumb/breadcrumb.component';
import {BusinessGroupService} from "@core/service/business-group.service";
import {BranchService} from "@core/http/table-data-services/Branch.service";
import {Branch} from "@core/models/Branch";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {Router} from "@angular/router";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {BranchDataSource} from "@core/data-source/BranchDataSource";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-branch-list',
  standalone: true,
    imports: [
        BreadcrumbComponent,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        FeatherIconsComponent,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        TopWidgetsComponent,
    ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss',
})
export class BranchListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'nombre',
    'direccion',
    'responsable',
    'correo',
    'actions'
  ];
  data?: BranchService;
  dataSource!: BranchDataSource;
  index?: number;
  idSucursal?: string;
  branch?: Branch;
  businessGroupId: string | null = null;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private gfs: GeneralFunctionsService,
    public branchService: BranchService,
    private businessGroupService: BusinessGroupService,
  ) {
    super();
  }

  ngOnInit() {
    this.businessGroupService.businessGroupId$.subscribe((id) => {
      this.businessGroupId = id;
      this.loadData();
    });
  }

  refresh() {
    this.ngOnInit();
  }

  addNew() {
    this.router.navigate(['branch/create-edit/' + this.businessGroupId]).then();
  }

  editCall(row: Branch) {
    this.router.navigate(['branch/create-edit/' + this.businessGroupId + '/' + row.idSucursal]).then();
  }

  deleteItem(row: Branch) {
    this.idSucursal = row.idSucursal;

    const dialogRef = this.dialog.open(DoDeleteComponent, {
      data: {
        toDelete: 'Sucursal',
        id: this.idSucursal,
        name: row.nombre,
        actionService: (id: string) => this.branchService.deleteBranch(id),
      }
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x): boolean => x.idSucursal === this.idSucursal
        );
        if (foundIndex != null && this.data) {
          this.refreshTable();
          this.refresh();
          this.gfs.showAlert('Medico eliminado correctamente', 'Correcto')
        }
      }
    });
  }

  goToProfile(row: Branch) {
    this.router.navigate(['branch/profile/' + this.businessGroupId + '/' + row.idSucursal]).then();
  }

  public loadData() {
    this.data = new BranchService(this.httpClient, this.gfs);
    this.dataSource = new BranchDataSource(
      this.businessGroupId,
      this.data,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter?.nativeElement.value;
      }
    );
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Nombre: x.nombre,
        Registro_Sanitario: x.registroSanitario,
        Status: x.status,
        Direccion: x.domicilio,
        Responsable: x.responsable,
        Cedula_Responable: x.cedulaResponsable,
        Telefono_Responsable: x.telefonoResponsable,
        Correo: x.emailResponsable,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

}
