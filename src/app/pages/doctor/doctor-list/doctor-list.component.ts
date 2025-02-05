// noinspection DuplicatedCode

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
import {DoctorService} from "@core/http/table-data-services/Doctor.service";
import {Doctor} from "@core/models/Doctor";
import {Router} from "@angular/router";
import {DoctorDataSource} from "@core/data-source/DoctorDataSource";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {UserRole} from "@core/models/Enums/UserRole";
import {BranchGroupService} from "@core/service/branch-group.service";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-doctor-list',
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
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'nombre',
    'especialidad',
    'cedula',
    'email',
    'asentamiento',
    'actions'
  ];
  idSucursal = '';
  data?: DoctorService;
  dataSource!: DoctorDataSource;
  index?: number;
  idMedico?: string;
  doctor?: Doctor;
  businessGroupId: string | null = null;
  branchGroupId: string | null = null;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private businessGroupService: BusinessGroupService,
    private gfs: GeneralFunctionsService,
    private doctorService: DoctorService,
    private branchGroupService: BranchGroupService,
  ) {
    super();
  }

  ngOnInit() {
    this.businessGroupService.businessGroupId$.subscribe((id) => {
      const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));
      if (userDetails.idTipoUsuario == UserRole.Responsable_Farmacia) {
        this.idSucursal = userDetails.idSucursal
      }
      this.businessGroupId = id;
      this.loadData();
    });

    this.branchGroupService.branchGroupId$.subscribe((id) => {
      const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));
      if (userDetails.idTipoUsuario == UserRole.Responsable_Farmacia) {
        this.idSucursal = userDetails.idSucursal
      }
      this.branchGroupId = id;
      this.idSucursal = id!;
      this.loadData();
    });
  }

  refresh() {
    this.ngOnInit();
  }

  addNew() {
    this.router.navigate(['doctor/create-edit']).then();
  }

  editCall(row: Doctor) {
    this.router.navigate(['doctor/create-edit/' + row.idUsuario]).then();
  }

  deleteItem(row: Doctor) {
    this.idMedico = row.idMedico;

    const dialogRef = this.dialog.open(DoDeleteComponent, {
      data: {
        toDelete: 'Medico',
        id: this.idMedico,
        name: row.nombres,
        actionService: (id: string) => this.doctorService.deleteMedic(id),
      }
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x): boolean => x.idMedico === this.idMedico
        );
        if (foundIndex != null && this.data) {
          this.data.dataChange.value.splice(foundIndex, 1);

          this.refreshTable();
          this.gfs.showAlert('Medico eliminado correctamente', 'Correcto')
        }
      }
    });
  }

  goToProfile(row: Doctor) {
    this.router.navigate(['doctor/profile/' + row.idMedico]).then();
  }

  public loadData() {
    this.data = new DoctorService(this.httpClient, this.gfs);
    this.dataSource = new DoctorDataSource(
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

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Nombre: x.nombres,
        Especialidad: x.especialidad,
        Cedula: x.cedulaGeneral,
        Telefono: x.movil,
        Email: x.email,
        Asentamiento: x.asentamiento
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
