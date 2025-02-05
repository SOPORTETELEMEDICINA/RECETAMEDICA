// noinspection DuplicatedCode

import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, merge} from "rxjs";
import {PatientService} from "@core/http/patient.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {Patient} from "@core/models/Patient";

export class PatientDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject('');
  filteredData: Patient[] = [];
  renderedData: Patient[] = [];

  constructor(
    public businessGroupId: string | null,
    public exampleDatabase: PatientService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  get filter(): string {
    return this.filterChange.value;
  }

  set filter(filter: string) {
    this.filterChange.next(filter);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect() {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllPatients(this.businessGroupId!);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((patient) => {
            const searchStr = (
              patient.nombres +
              patient.genero +
              patient.edad +
              patient.fechaNacimiento +
              patient.email +
              patient.movil +
              patient.status
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  sortData(data: Patient[]): Patient[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'name':
          [propertyA, propertyB] = [a.nombres, b.nombres];
          break;
        case 'gender' :
          [propertyA, propertyB] = [a.genero, b.genero];
          break;
        case 'age' :
          [propertyA, propertyB] = [a.edad, b.edad];
          break;
        case 'bDate' :
          [propertyA, propertyB] = [a.fechaNacimiento, b.fechaNacimiento];
          break;
        case 'email' :
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'mobile' :
          [propertyA, propertyB] = [a.movil, b.movil];
          break;
        case 'status' :
          [propertyA, propertyB] = [a.status, b.status];
          break;

      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
