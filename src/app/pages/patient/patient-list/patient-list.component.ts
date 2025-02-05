import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PatientService} from '@core/http/patient.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {fromEvent} from 'rxjs';
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter,} from '@shared';
import {formatDate, NgIf, NgOptimizedImage} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {FeatherIconsComponent} from '@shared/components/feather-icons/feather-icons.component';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BreadcrumbComponent} from '@shared/components/breadcrumb/breadcrumb.component';
import {BusinessGroupService} from "@core/service/business-group.service";
import {PatientDataSource} from "@core/data-source/PatientDataSource";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {Patient} from "@core/models/Patient";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {Router} from "@angular/router";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {PatientDiagnosticsComponent} from "./patient-diagnostics/patient-diagnostics.component";
import {auto} from "@popperjs/core";
import {AuthManagementService} from "@core/service/auth-management.service";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    NgOptimizedImage,
    FormatMobilePipe,
    NgIf,
    TopWidgetsComponent
  ],
})

export class PatientListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  isUserDoctor: boolean = false;
  isUserAdmin: boolean = false;

  displayedColumns = [
    'name',
    'bDate',
    'email',
    'mobile',
    'status',
    'antecedentes',
    'actions',
  ];

  data?: PatientService;
  dataSource!: PatientDataSource;
  index?: number;
  idPaciente?: string;
  patient?: Patient;
  businessGroupId: string | null = null;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;
  @Input() control: number = 1;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    public patientService: PatientService,
    private authManagement: AuthManagementService,
    private businessGroupService: BusinessGroupService,
    private gfs: GeneralFunctionsService
  ) {
    super();
  }

  ngOnInit() {
    this.businessGroupService.businessGroupId$.subscribe((id) => {
      this.businessGroupId = id;
      this.loadData();
    });
    this.isUserDoctor = this.authManagement.isUserDoctor();
    this.isUserAdmin = this.authManagement.isUserAdmin();
  }

  refresh() {
    this.ngOnInit();
  }

  addNew() {
    this.router.navigate(['patient/create-edit']).then();
  }

  editCall(row: Patient) {
    this.router.navigate(['patient/create-edit/' + row.idUsuario]).then();
  }

  goToProfile(row: Patient) {
    this.router.navigate(['patient/profile/' + row.idUsuario]).then();
  }

  showDiagnostics(row: Patient) {
    this.dialog.open(PatientDiagnosticsComponent, {
      width: '800px',
      height: auto,
      data: {
        diagnostics: row,
      },
    });
  }

  deleteItem(row: Patient) {
    this.idPaciente = row.idPaciente;

    const dialogRef = this.dialog.open(DoDeleteComponent, {
      data: {
        toDelete: 'Paciente',
        id: this.idPaciente,
        name: row.nombres,
        actionService: (id: string) => this.patientService.deletePatient(id),
      }
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x): boolean => x.idPaciente === this.idPaciente
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
      this.dataSource.filteredData.map((x: Patient) => ({
        Nombre: x.nombres,
        Genero: x.genero,
        Edad: x.edad,
        'Fecha de nacimiento': formatDate(new Date(x.fechaNacimiento), 'yyyy-MM-dd', 'en') || '',
        Correo: x.email,
        Telefono: x.movil,
        Estatus: x.status
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  public loadData() {
    this.data = new PatientService(this.httpClient, this.gfs);
    this.dataSource = new PatientDataSource(
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

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
