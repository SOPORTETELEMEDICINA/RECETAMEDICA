// noinspection DuplicatedCode

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {DoctorService} from "@core/http/table-data-services/Doctor.service";
import {DoctorByIdBranch} from "@core/data-source/DoctorByIdBranch";
import {Doctor} from "@core/models/Doctor";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
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

@Component({
  selector: 'app-doctor-by-branch',
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
    FormatMobilePipe,
  ],
  templateUrl: './doctor-by-branch.component.html',
  styleUrl: './doctor-by-branch.component.scss'
})
export class DoctorByBranchComponent
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
  @Input() idBranch!: string | null;

  data?: DoctorService;
  dataSource!: DoctorByIdBranch;
  index?: number;
  idMedico?: string;
  doctor?: Doctor;
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
    private doctorService: DoctorService,
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.ngOnInit();
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
    this.dataSource = new DoctorByIdBranch(
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
