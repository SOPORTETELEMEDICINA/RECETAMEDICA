import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
import {UserService} from "@core/http/table-data-services/User.service";
import {UserDetails} from "@core/models/UserDetails";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {Router} from "@angular/router";
import {UserDataSource} from "@core/data-source/UserDataSource";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {UserRole} from "@core/models/Enums/UserRole";
import {BranchGroupService} from "@core/service/branch-group.service";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-users',
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
    FormatMobilePipe,
    TopWidgetsComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'nombre',
    'tipoUsuario',
    'direccion',
    'correo',
    'asentamiento',
    'actions'
  ];
  idSucursal = '';
  data?: UserService;
  dataSource!: UserDataSource;
  index?: number;
  idUsuario?: string;
  user?: UserDetails;
  businessGroupId: string | null = null;
  branchGroupId: string | null = null;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;
  @Input() control: number = 1;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public userService: UserService,
    private gfs: GeneralFunctionsService,
    private router: Router,
    private businessGroupService: BusinessGroupService,
    private branchGroupService: BranchGroupService,
  ) {
    super();
  }

  ngOnInit() {
    this.businessGroupService.businessGroupId$.subscribe((id) => {
      const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));
      if (userDetails.idTipoUsuario == UserRole.Supervisor_Sucursales) {
        this.idSucursal = userDetails.idSucursal
      }
      this.businessGroupId = id;
      this.loadData();
    });

    this.branchGroupService.branchGroupId$.subscribe((id) => {
      const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));
      if (userDetails.idTipoUsuario == UserRole.Supervisor_Sucursales) {
        this.idSucursal = userDetails.idSucursal
        this.idSucursal = id!;
      }
      this.branchGroupId = id;
      this.loadData();
    });
  }

  refresh() {
    this.ngOnInit();
  }

  addNew() {
    this.router.navigate(['admin/create-edit']).then();
  }

  editCall(row: UserDetails) {
    this.router.navigate(['admin/create-edit/' + row.idUsuario + '/' + row.idGEMP]).then();
  }

  goToProfile(row: UserDetails) {
    this.router.navigate(['admin/profile/' + row.idUsuario + '/' + row.idGEMP]).then();
  }

  deleteItem(row: UserDetails) {
    this.idUsuario = row.idUsuario;

    const dialogRef = this.dialog.open(DoDeleteComponent, {
      data: {
        toDelete: 'Usuario',
        id: this.idUsuario,
        name: row.nombres,
        actionService: (id: string) => this.userService.deleteUser(id),
      }
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x): boolean => x.idUsuario === this.idUsuario
        );
        if (foundIndex != null && this.data) {
          this.data.dataChange.value.splice(foundIndex, 1);

          this.refreshTable();
          this.gfs.showAlert('Paciente eliminado correctamente', 'Correcto')
        }
      }
    });
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x: UserDetails) => ({
        Nombre: x.nombres,
        Tipo: x.tipoUsuario,
        Telefono: x.movil,
        Direccion: x.domicilio,
        Municipio: x.municipio,
        CP: x.codigoPostal,
        Correo: x.email,
        Asentamiento: x.nombreAsentamiento,
        Sucursal: x.nombreSucursal
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  public loadData() {
    this.data = new UserService(this.httpClient, this.gfs);
    this.dataSource = new UserDataSource(
      this.businessGroupId,
      this.data,
      this.paginator,
      this.sort,
      this.idSucursal
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

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}


