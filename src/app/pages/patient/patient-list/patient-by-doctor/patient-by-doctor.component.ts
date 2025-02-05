// noinspection DuplicatedCode

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatRippleModule} from "@angular/material/core";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTooltipModule} from "@angular/material/tooltip";
import {formatDate, NgOptimizedImage} from "@angular/common";
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {PatientService} from "@core/http/patient.service";
import {Patient} from "@core/models/Patient";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {PatientDiagnosticsComponent} from "../patient-diagnostics/patient-diagnostics.component";
import {auto} from "@popperjs/core";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {fromEvent} from "rxjs";
import {PatientByIdDoctorDataSource} from "@core/data-source/PatientByIdDoctorDataSource";

@Component({
  selector: 'app-patient-by-doctor',
  standalone: true,
  imports: [
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
    FormatMobilePipe
  ],
  templateUrl: './patient-by-doctor.component.html',
  styleUrl: './patient-by-doctor.component.scss'
})
export class PatientByDoctorComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

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
  dataSource!: PatientByIdDoctorDataSource;
  index?: number;
  idPaciente?: string;
  patient?: Patient;
  @Input() idDoctor!: string | null;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    public patientService: PatientService,
    private gfs: GeneralFunctionsService
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.ngOnInit();
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
    this.dataSource = new PatientByIdDoctorDataSource(
      this.idDoctor,
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
