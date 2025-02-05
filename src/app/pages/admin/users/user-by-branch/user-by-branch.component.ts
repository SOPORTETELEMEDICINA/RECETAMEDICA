import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {UserService} from "@core/http/table-data-services/User.service";
import {UserDetails} from "@core/models/UserDetails";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {Router} from "@angular/router";
import {BusinessGroupService} from "@core/service/business-group.service";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {fromEvent} from "rxjs";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {UserByIdBranch} from "@core/data-source/UserByIdBranch";

@Component({
  selector: 'app-user-by-branch',
  standalone: true,
  imports: [
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
    FormatMobilePipe
  ],
  templateUrl: './user-by-branch.component.html',
  styleUrl: './user-by-branch.component.scss'
})
export class UserByBranchComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'nombre',
    'direccion',
    'correo',
    'asentamiento',
    'actions'
  ];

  @Input() idBranch!: string | null;
  data?: UserService;
  dataSource!: UserByIdBranch;
  index?: number;
  idUsuario?: string;
  user?: UserDetails;
  businessGroupId: string | null = null;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public userService: UserService,
    private gfs: GeneralFunctionsService,
    private router: Router,
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
    this.dataSource = new UserByIdBranch(
      this.idBranch,
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

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
