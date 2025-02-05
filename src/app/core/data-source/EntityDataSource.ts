import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {Entity} from "@core/models/Entity";
import {EntityService} from "@core/http/table-data-services/entity.service";

export class EntityDataSource extends DataSource<Entity> {
  filterChange = new BehaviorSubject('');
  filteredData: Entity[] = [];
  renderedData: Entity[] = [];

  constructor(
    public exampleDatabase: EntityService,
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
  connect(): Observable<Entity[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllEntities();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((entity: Entity) => {
            const searchStr = (
              entity.idEntidad +
              entity.nombre +
              entity.abreviatura +
              entity.idPais
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
  sortData(data: Entity[]): Entity[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idEntidad':
          [propertyA, propertyB] = [a.idEntidad, b.idEntidad];
          break;
        case 'nombre' :
          [propertyA, propertyB] = [a.nombre, b.nombre];
          break;
        case 'abreviatura' :
          [propertyA, propertyB] = [a.abreviatura, b.abreviatura];
          break;
        case 'idPais' :
          [propertyA, propertyB] = [a.idPais, b.idPais];
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
