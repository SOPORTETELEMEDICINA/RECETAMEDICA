/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexGrid,
  NgApexchartsModule,
  ApexResponsive,
  ApexFill,
} from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { AuthManagementService } from '@core/service/auth-management.service';
import { GeneralService } from '@core/http/general.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { DashboardKpiResponse } from '@core/models/Http/Response/DashboardKpiResponse';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { PatientEditCreateComponent } from '../patient/patient-list/patient-edit-create/patient-edit-create.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  DatatableComponent,
  NgxDatatableModule,
  SortType,
} from '@swimlane/ngx-datatable';
import { PatientDetails } from '@core/models/PatientDetails';
import { NgFor } from '@angular/common';
import { UserDetails } from '@core/models/UserDetails';
import { AdminService } from '@core/http/admin.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  grid: ApexGrid;
  colors: string[];
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    NgApexchartsModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    NgIf,
    FeatherIconsComponent,
    MatMenuModule,
    NgApexchartsModule,
    NgForOf,
    NgFor,
    NgxDatatableModule,
    NgClass,
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;
  chart!: ChartComponent;
  public areaChartOptions!: Partial<ChartOptions>;
  public smallChart1Options!: Partial<ChartOptions>;
  public smallChart2Options!: Partial<ChartOptions>;
  public smallChart3Options!: Partial<ChartOptions>;
  public smallChart4Options!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;

  userName!: string;

  isUserDoctor: boolean;
  employees: number;
  prescriptions: number;
  patients: number;
  data: PatientDetails[] = [];
  filteredData: PatientDetails[] = [];

  columns = [
    { prop: 'nombres', name: 'Nombre' },
    { prop: 'domicilio', name: 'Domicilio' },
    { prop: 'fechaNacimiento', name: 'Fecha de Nacimiento' },
    { prop: 'email', name: 'Correo' },
    { prop: 'movil', name: 'Telefono' },
    { prop: 'status', name: 'Estatus' },
  ];

  constructor(
    private authManagement: AuthManagementService,
    private generalService: GeneralService,
    private dialogModel: MatDialog,
    private adminService: AdminService,
    private router: Router
  ) {
    this.isUserDoctor = false;

    this.employees = 0;
    this.prescriptions = 0;
    this.patients = 0;
  }

  ngOnInit() {
    const userData = this.authManagement.userData();

    this.userName = userData.unique_name;

    this.isUserDoctor = this.authManagement.isUserDoctor();

    this.getKpis();
    this.getPatients();

    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
    this.chart1();
    this.chart2();
  }

  filterDatatable(event: any) {
    // obtener el valor del input y convertirlo a minúsculas
    const val = event.target.value.toLowerCase();

    // si no hay valor en el input, restaurar todos los datos
    if (!val) {
      this.data = [...this.filteredData]; // restaurar los datos originales
      this.table.offset = 0; // regresar a la primera página

      console.log(this.data);

      return;
    }

    // obtener los nombres de las claves de cada columna en el dataset
    const keys = Object.keys(this.data[0]);

    // asignar los resultados filtrados al datatable activo
    this.data = this.filteredData.filter((item: any) => {
      // iterar sobre los datos de cada columna en la fila
      for (let key of keys) {
        const value = item[key];
        // verificar si hay una coincidencia
        if (value && value.toString().toLowerCase().indexOf(val) !== -1) {
          return true; // se encontró coincidencia, mantener el registro
        }
      }
      return false; // no hay coincidencia, eliminar el registro
    });

    // siempre regresar a la primera página cuando el filtro cambie
    this.table.offset = 0;
  }

  getPatients() {
    this.adminService.getPatients().subscribe({
      next: (res: DefaultResponse<PatientDetails[]>) => {
        this.data = [...res.data];
        this.filteredData = [...res.data];
      },
    });
  }

  getKpis() {
    this.generalService.getKpiDoctorBranchManager().subscribe({
      next: (res: DefaultResponse<DashboardKpiResponse[]>) => {
        if (res.data.length) {
          const [kpi] = res.data;

          this.prescriptions = kpi.countRecetas;

          if (this.isUserDoctor) {
            this.patients = kpi.countPacientes;
          } else {
            this.employees = kpi.countPacientes;
          }
        }
      },
    });
  }

  deleteRow(row: PatientDetails) {
    this.data = this.arrayRemove(this.data, row.idUsuario);
  }

  arrayRemove(array: PatientDetails[], id: string) {
    return array.filter(function (element: PatientDetails) {
      return element.idUsuario != id;
    });
  }

  openUserModal() {
    this.dialogModel.open(PatientEditCreateComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '850px',
      // height: '850px',
    });
  }

  routeToNewPrescription() {
    this.router.navigate(['/prescription/create']);
  }

  private smallChart1() {
    this.smallChart1Options = {
      series: [
        {
          name: 'Appointments',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#6F42C1'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart2() {
    this.smallChart2Options = {
      series: [
        {
          name: 'Operations',
          data: [5, 6, 8, 5, 7, 5, 6, 4, 3, 4, 7, 4, 9, 6, 5, 6],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FD7E14'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart3() {
    this.smallChart3Options = {
      series: [
        {
          name: 'New Patients',
          data: [
            50, 61, 80, 50, 72, 52, 60, 41, 30, 45, 70, 40, 93, 63, 50, 62,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#4CAF50'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  private smallChart4() {
    this.smallChart4Options = {
      series: [
        {
          name: 'Earning',
          data: [
            150, 161, 180, 150, 172, 152, 160, 141, 130, 145, 170, 140, 193,
            163, 150, 162,
          ],
        },
      ],
      chart: {
        height: 70,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#2196F3'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          '16-07-2018',
          '17-07-2018',
          '18-07-2018',
          '19-07-2018',
          '20-07-2018',
          '21-07-2018',
          '22-07-2018',
          '23-07-2018',
          '24-07-2018',
          '25-07-2018',
          '26-07-2018',
          '27-07-2018',
          '28-07-2018',
          '29-07-2018',
          '30-07-2018',
          '31-07-2018',
        ],
      },
      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'New Patients',
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: 'Old Patients',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#407fe4', '#908e8e'],
      dataLabels: {
        enabled: false,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-09-19',
          '2018-09-20',
          '2018-09-21',
          '2018-09-22',
          '2018-09-23',
          '2018-09-24',
          '2018-09-25',
        ],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: 'Colds and Flu',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'Headaches',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'Malaria',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'Typhoid',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#9aa0ac',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 0.8,
        colors: ['#01B8AA', '#374649', '#FD625E', '#F2C80F'],
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  protected readonly SortType = SortType;
}
