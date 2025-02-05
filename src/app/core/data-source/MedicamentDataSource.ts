import {DataSource} from "@angular/cdk/collections";
import {merge, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {Medicament} from "@core/models/Medicament";
import {MedicamentService} from "@core/http/table-data-services/medicament.service";

export class MedicamentDataSource extends DataSource<Medicament> {

  filteredData: Medicament[] = [];
  renderedData: Medicament[] = [];

  constructor(
    public exampleDatabase: MedicamentService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public name: string
  ) {
    super();
    this.filteredData = [];
    this.renderedData = [];
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Medicament[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllMedicaments(this.name);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data.filter((medicament) =>
          medicament.nombre.toLowerCase().includes(this.name.toLowerCase())
        );

        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
        return this.renderedData;
      })
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  sortData(data: Medicament[]): Medicament[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'nombre':
          [propertyA, propertyB] = [a.nombre, b.nombre];
          break;
        case 'summary':
          [propertyA, propertyB] = [a.summary, b.summary];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
