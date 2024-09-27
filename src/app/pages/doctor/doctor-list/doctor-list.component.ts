import { Component, ViewChild } from '@angular/core';
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
import { DoctorEditCreateComponent } from './doctor-edit-create/doctor-edit-create.component';

import {
  DatatableComponent,
  SortType,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import { User } from '@core/models/User';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-doctor-list',
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
  ],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent {
  @ViewChild(DatatableComponent, { static: false }) table2!: DatatableComponent;
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  SortType = SortType;
  register?: UntypedFormGroup;

  selectedRowData?: selectRowInterface;

  columns = [
    { name: 'First Name' },
    { name: 'Last Name' },
    { name: 'Gender' },
    { name: 'Phone' },
    { name: 'Email' },
    { name: 'Address' },
  ];

  data: User[] = [];
  filteredData: User[] = [];

  genders = [
    { id: '1', value: 'Male' },
    { id: '2', value: 'Female' },
  ];

  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  constructor(private dialogModel: MatDialog) {}

  filterDatatable(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const colsAmt = this.columns.length;

    this.data = this.filteredData.filter(function (item: User) {
      for (let i = 0; i < colsAmt; i++) {
        if (
          item.empleado.toString().toLowerCase().indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
      return false;
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  deleteRow(row: User) {
    this.data = this.arrayRemove(this.data, row.folio);
  }

  arrayRemove(array: User[], id: string) {
    return array.filter(function (element: User) {
      return element.folio != id;
    });
  }

  openUserModal() {
    this.dialogModel.open(DoctorEditCreateComponent, {
      width: '640px',
      disableClose: true,
    });
  }
}

export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}
