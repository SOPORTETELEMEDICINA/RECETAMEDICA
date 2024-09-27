import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { PatientEditCreateComponent } from './patient-edit-create/patient-edit-create.component';

import {
  DatatableComponent,
  SortType,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { User } from '@core/models/User';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '@core/http/admin.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { UserDetails } from '@core/models/UserDetails';
import {NgClass, NgFor} from '@angular/common';
import {PatientDetails} from "@core/models/PatientDetails";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatIconModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    FeatherIconsComponent,
    NgClass,
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  SortType = SortType;
  register?: UntypedFormGroup;

  selectedRowData?: selectRowInterface;

  columns = [
    { prop: 'nombres', name: 'Nombre' },
    { prop: 'domicilio', name: 'Domicilio' },
    { prop: 'fechaNacimiento', name: 'Fecha de Nacimiento' },
    { prop: 'email', name: 'Correo' },
    { prop: 'movil', name: 'Telefono' },
    { prop: 'status', name: 'Estatus' },
  ];

  data: PatientDetails[] = [];
  filteredData: PatientDetails[] = [];

  constructor(
    private dialogModel: MatDialog,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getUsers();
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

  getUsers() {
    this.adminService.getPatients().subscribe({
      next: (res: DefaultResponse<PatientDetails[]>) => {
        this.data = [...res.data];
        this.filteredData = [...res.data];
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
    this.dialogModel
      .open(PatientEditCreateComponent, {
        disableClose: true,
        maxWidth: '100vw',
        maxHeight: '100vw',
        width: '850px',
        height: '850px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.getUsers();
      });
  }
}

export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}
