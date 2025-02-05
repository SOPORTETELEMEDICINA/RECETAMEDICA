import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {PrescriptionService} from "@core/http/table-data-services/prescription.service";
import {PrescriptionData} from "@core/models/PrescriptionData";
import {Prescription} from "@core/models/Prescription";

export class PrescriptionDataSource extends DataSource<PrescriptionData> {
  filterChange = new BehaviorSubject('');
  filteredData: PrescriptionData[] = [];
  renderedData: PrescriptionData[] = [];

  constructor(
    public exampleDatabase: PrescriptionService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public prescriptions: Prescription[]
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
  connect(): Observable<PrescriptionData[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllprescriptions(this.prescriptions);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((prescription: PrescriptionData) => {
            const searchStr = (
              prescription.receta.idReceta +
              prescription.receta.nombresMedico +
              prescription.receta.nombresPaciente +
              prescription.receta.primerApellidoMedico +
              prescription.receta.primerApellidoPaciente +
              prescription.receta.idReceta +
              prescription.receta.segundoApellidoMedico +
              prescription.receta.segundoApellidoPaciente +
              prescription.receta.fechaCreacion

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
  sortData(data: PrescriptionData[]): PrescriptionData[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'medico':
          [propertyA, propertyB] = [a.receta.nombresMedico, b.receta.nombresMedico];
          break;
        case 'paciente':
          [propertyA, propertyB] = [a.receta.nombresPaciente, b.receta.nombresPaciente];
          break;
        case 'creacion':
          [propertyA, propertyB] = [a.receta.fechaCreacion, b.receta.fechaCreacion];
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

