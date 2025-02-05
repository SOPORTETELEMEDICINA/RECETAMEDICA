import {DataSource} from "@angular/cdk/collections";
import {merge, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {Diagnostic} from "@core/models/Diagnostic";
import {DiagnosticService} from "@core/http/table-data-services/diagnostic.service";

export class DiagnosticDataSource extends DataSource<Diagnostic> {

  filteredData: Diagnostic[] = [];
  renderedData: Diagnostic[] = [];

  constructor(
    public exampleDatabase: DiagnosticService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public name: string
  ) {
    super();
    this.filteredData = [];
    this.renderedData = [];
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Diagnostic[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllDiagnostics(this.name);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data.filter((medicament) =>
          medicament.nameCIM10.toLowerCase().includes(this.name.toLowerCase())
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
  sortData(data: Diagnostic[]): Diagnostic[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idCIM10':
          [propertyA, propertyB] = [a.idCIM10, b.idCIM10];
          break;
        case 'nameCIM10':
          [propertyA, propertyB] = [a.nameCIM10, b.nameCIM10];
          break;
        case 'code':
          [propertyA, propertyB] = [a.code, b.code];
          break;

      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
