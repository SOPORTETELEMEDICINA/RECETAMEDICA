import {DataSource} from "@angular/cdk/collections";
import {GEMP} from "../models/GEMP";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {GEMPService} from "../http/table-data-services/GEMP.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";

export class GroupsDataSource extends DataSource<GEMP> {
  filterChange = new BehaviorSubject('');
  filteredData: GEMP[] = [];
  renderedData: GEMP[] = [];

  constructor(
    public exampleDatabase: GEMPService,
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
  connect(): Observable<GEMP[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllGEMPs();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((gemp: GEMP) => {
            const searchStr = (
              gemp.idGEMP +
              gemp.nombre +
              gemp.logoBase64
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
  sortData(data: GEMP[]): GEMP[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idGEMP':
          [propertyA, propertyB] = [a.idGEMP, b.idGEMP];
          break;
        case 'nombre' :
          [propertyA, propertyB] = [a.nombre, b.nombre];
          break;
        case 'logoBase64' :
          [propertyA, propertyB] = [a.logoBase64, b.logoBase64];
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
