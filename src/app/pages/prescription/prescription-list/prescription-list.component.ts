import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {fromEvent} from "rxjs";
import {MatTooltip, MatTooltipModule} from "@angular/material/tooltip";
import {MatButton, MatButtonModule, MatMiniFabButton} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from "@angular/material/table";
import {MatOption, MatRipple, MatRippleModule} from "@angular/material/core";
import {PrescriptionService} from "@core/http/table-data-services/prescription.service";
import {PrescriptionDataSource} from "@core/data-source/PrescriptionDataSource";
import {Prescription} from "@core/models/Prescription";
import {AuthManagementService} from "@core/service/auth-management.service";
import {UserRole} from "@core/models/Enums/UserRole";
import {FilterReceta} from "@core/models/FilterReceta";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {CatalogsService} from "@core/http/catalogs.service";
import {Branch} from "@core/models/Branch";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import Swal from "sweetalert2";
import {PrescriptionData} from "@core/models/PrescriptionData";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {PrescriptionDiagnosticsComponent} from "./prescription-diagnostics/prescription-diagnostics.component";
import {auto} from "@popperjs/core";
import {PrescriptionMedsComponent} from "./prescription-meds/prescription-meds.component";
// import {PdfGeneratorService} from "@core/service/pdf-generator.service";
import {DoDeleteComponent} from "@shared/components/do-delete/do-delete.component";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-prescription-list',
  standalone: true,
    imports: [
        BreadcrumbComponent,
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        MatLabel,
        MatIcon,
        MatOption,
        MatSelect,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatSuffix,
        MatTooltip,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRow,
        MatRow,
        MatHeaderRowDef,
        MatRowDef,
        MatRipple,
        MatSort,
        MatDatepickerModule,
        MatPaginator,
        MatMiniFabButton,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NgOptimizedImage,
        NgIf,
        FeatherIconsComponent,
        TopWidgetsComponent
    ],
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.scss',
})
export class PrescriptionListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'medico',
    'paciente',
    'detalles',
    'creacion',
    'antecedentes',
    'medicamentos',
    'descargar'
  ];

  data?: PrescriptionService;
  dataSource!: PrescriptionDataSource;
  index?: number;
  userRole!: string;
  isAdmin: boolean;

  filterReceta: FilterReceta;

  businessGroups: BusinessGroup[] = [];
  branches: Branch[] = [];

  opcionesDiaMesAnio = ['Dia', 'Mes', 'Año'];

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;
  protected readonly UserRole = UserRole;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private authManagement: AuthManagementService,
    private catalogsService: CatalogsService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private gfs: GeneralFunctionsService,
    private service: PrescriptionService,
    // private pdfGeneratorService: PdfGeneratorService
  ) {
    super();
    const userData = this.authManagement.userData();
    this.userRole = userData.IdRol;
    this.isAdmin = this.authManagement.isUserAdmin();

    this.filterReceta = new FilterReceta({
      dateFilter: 'Dia',
      endDate: null,
      idGEMP: userData.GEMP,
      idSucursal: userData.IdSucursal,
      startDate: null
    })
    this.isAdmin ? this.getBusinessGroups() : this.getBusinessGroupsById(userData.GEMP);
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
    this.getBranchesByGemp(userData.GEMP);
  }

  ngOnInit() {
    this.loadData();
    this.cd.detectChanges();
  }

  refresh() {
    this.ngOnInit();
  }

  addNew() {
    this.router.navigate(['prescription/create']).then();
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x: PrescriptionData) => ({
        ID: x.receta.idReceta,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  public loadData(prescriptions: Prescription[] = []) {
    this.data = new PrescriptionService(this.httpClient, this.gfs);
    this.dataSource = new PrescriptionDataSource(
      this.data,
      this.paginator,
      this.sort,
      prescriptions
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

  getBusinessGroups(): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
      },
    });
  }

  getBusinessGroupsById(idGEMP: string): void {
    this.catalogsService.getGempbyIdGemp(idGEMP).subscribe({
      next: (res: DefaultResponse<BusinessGroup>) => {
        this.businessGroups.push(res.data)
      },
    });
  }

  getBranchesByGemp(idGEMP: string) {
    this.catalogsService.getBranchesByIdGEMP(idGEMP).subscribe({
      next: (res: DefaultResponse<Branch[]>) => {
        this.branches = [...res.data];
      },
    });
  }

  buscar() {
    const startDate = this.filterReceta.startDate ? new Date(this.filterReceta.startDate) : null;
    const endDate = this.filterReceta.endDate ? new Date(this.filterReceta.endDate) : null;

    if (startDate) {
      this.filterReceta.startDate = startDate.toISOString().split('T')[0];
    }
    if (endDate) {
      this.filterReceta.endDate = endDate.toISOString().split('T')[0];
    }

    if (startDate && endDate && startDate > endDate) {
      Swal.fire('Error', 'La fecha final debe ser mayor que la fecha inicial.', 'error').then();
      return;
    }

    if (!startDate && !endDate && !this.filterReceta.dateFilter) {
      Swal.fire('Error', 'Seleccione rango de fechas o por Día , Mes, Año.', 'error').then();
      return;
    }

    this.service.getAllprescriptionsData(this.filterReceta).subscribe({
      next: (data: DefaultResponse<Prescription[]>) => {
        this.loadData(data.data);
        console.log(data.data)
        this.cd.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.gfs.showErrorAlert('No se pudieron obtener las Recetas.', error)
      },
    });
  }

  clearDate(field: 'startDate' | 'endDate'): void {
    this.filterReceta[field] = null;
  }

  onDateFilterChange(): void {
    if (this.filterReceta.dateFilter) {
      this.filterReceta.startDate = null;
      this.filterReceta.endDate = null;
    }
  }

  onDateChange(): void {
    if (this.filterReceta.startDate || this.filterReceta.endDate) {
      this.filterReceta.dateFilter = null;
    }
  }

  onBranchChange(idGemp: string): void {
    this.filterReceta.idSucursal = null;
    this.getBranchesByGemp(idGemp);
  }

  showMedicaments(row: PrescriptionData) {
    this.dialog.open(PrescriptionMedsComponent, {
      maxWidth: 'none',
      height: auto,
      data: {
        detalles: row.detalles,
        dialogTitle: row.receta.nombresPaciente + ' ' +
          row.receta.primerApellidoPaciente + ' ' +
          row.receta.segundoApellidoPaciente
      },
    });
  }

  showHistory(row: PrescriptionData) {
    this.dialog.open(PrescriptionDiagnosticsComponent, {
      width: '800px',
      height: auto,
      data: {
        alergias: row.receta.alergias,
        moleculas: row.receta.molecules,
        patologias: row.receta.patologias,
        paciente: row.receta.nombresPaciente + ' ' +
          row.receta.primerApellidoPaciente + ' ' +
          row.receta.segundoApellidoPaciente
      },
    });
  }

  // descargarPDF(row: PrescriptionData) {
  //   const {idReceta, idPaciente} = row.receta;
  //   console.log()
  //   this.catalogsService.getRecetaByIdReceta(idReceta, idPaciente).subscribe({
  //     next: (res: string) => {
  //       this.pdfGeneratorService.generatePDF(res, 'my-document.pdf').then();
  //     },
  //   })
  //
  // }

  descargarPDF(row: PrescriptionData) {
    const {idReceta, idPaciente} = row.receta;

    this.catalogsService.getRecetaByIdReceta(idReceta, idPaciente).subscribe({
      next: (res: string) => {
        // Aquí se envía el contenido recibido (res) al servicio de impresión
        this.printHtml(res);
      },
    });
  }

// Función para manejar el contenido HTML e imprimirlo
  /*printHtml(fullHtmlString: string): void {
    // Dimensiones de la ventana de impresión
    const printWidth = 1000; // Ancho en píxeles
    const printHeight = 800; // Alto en píxeles

    // Asegurarse de que screen.width y screen.height sean tratados como números
    const screenWidth = window.screen.width || 1920; // Valor predeterminado si no se encuentra
    const screenHeight = window.screen.height || 1080; // Valor predeterminado si no se encuentra

    // Calcular la posición para centrar la ventana
    const left = Math.max((screenWidth - printWidth) / 2, 0);
    const top = Math.max((screenHeight - printHeight) / 2, 0);

    // Convertir las propiedades a strings explícitamente
    const features = width=${printWidth},height=${printHeight},top=${top},left=${left};

    // Crear la ventana de impresión centrada
    const printWindow = window.open('', '_blank', features);

    if (!printWindow) {
      console.error('No se pudo abrir la ventana de impresión');
      return;
    }

    // Escribir el contenido HTML completo en la nueva ventana
    printWindow.document.open();
    printWindow.document.write(fullHtmlString); // Inyectar el HTML recibido
    printWindow.document.close();

    // Mostrar el diálogo de impresión
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close(); // Cerrar automáticamente después de imprimir
    };
  }*/

  printHtml(fullHtmlString: string): void {
    // Dimensiones de la ventana de impresión
    const printWidth = 1000; // Ancho en píxeles
    const printHeight = 800; // Alto en píxeles

    // Asegurarse de que screen.width y screen.height sean tratados como números
    const screenWidth = window.screen.width || 1920; // Valor predeterminado si no se encuentra
    const screenHeight = window.screen.height || 1080; // Valor predeterminado si no se encuentra

    // Calcular la posición para centrar la ventana
    const left = Math.max((screenWidth - printWidth) / 2, 0);
    const top = Math.max((screenHeight - printHeight) / 2, 0);

    // Convertir las propiedades a strings explícitamente
    const features = `width=${printWidth},height=${printHeight},top=${top},left=${left}`;

    // Crear la ventana de impresión centrada
    const printWindow = window.open('', '_blank', features);

    if (!printWindow) {
      console.error('No se pudo abrir la ventana de impresión');
      return;
    }

    // Escribir el contenido HTML completo en la nueva ventana
    printWindow.document.open();
    printWindow.document.write(fullHtmlString); // Inyectar el HTML recibido
    printWindow.document.close();

    // Mostrar el diálogo de impresión
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close(); // Cerrar automáticamente después de imprimir
    };
  }

  deleteItem(row: PrescriptionData) {
    const {idReceta} = row.receta;

    const dialogRef = this.dialog.open(DoDeleteComponent, {
      data: {
        toDelete: 'Receta',
        id: idReceta,
        name: 'esta receta',
        actionService: (id: string) => this.service.deletePrescription(id),
      }
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x): boolean => x.receta.idReceta === idReceta
        );
        if (foundIndex != null && this.data) {
          this.refreshTable();
          this.refresh();
          this.gfs.showAlert('Receta eliminada correctamente', 'Correcto')
        }
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
