import {DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";
import {PostalCode} from "@core/models/PostalCode";
import {PostalCodeService} from "@core/http/table-data-services/cp.service";
import {Entity} from "@core/models/Entity";
import {Township} from "@core/models/Township";

export class PostalCodeDataSource extends DataSource<PostalCode> {
  filterChange = new BehaviorSubject('');
  filteredData: PostalCode[] = [];
  renderedData: PostalCode[] = [];

  constructor(
    public exampleDatabase: PostalCodeService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public searchType: string,
    public entidad: Entity,
    public municipio?: Township,
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
  connect(): Observable<PostalCode[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.searchType === 'Entity'
      ? this.exampleDatabase.getPostalCodeByIdEntidad(
        this.entidad.idEntidad,
        this.entidad.nombre
      )
      : this.exampleDatabase.getPostalCodeByIdMunicipio(
        this.municipio!.idMunicipio,
        this.entidad.nombre,
        this.municipio!.nombre
      )
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((postalCode: PostalCode) => {
            const searchStr = (
              postalCode.idCP +
              postalCode.codigoPostal +
              postalCode.idEntidad +
              postalCode.idMunicipio +
              postalCode.nombreEntidad +
              postalCode.nombreMunicipio
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
  sortData(data: PostalCode[]): PostalCode[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'idCP':
          [propertyA, propertyB] = [a.idCP, b.idCP];
          break;
        case 'codigoPostal':
          [propertyA, propertyB] = [a.codigoPostal, b.codigoPostal];
          break;
        case 'idEntidad':
          [propertyA, propertyB] = [a.idEntidad, b.idEntidad];
          break;
        case 'idMunicipio' :
          [propertyA, propertyB] = [a.idMunicipio, b.idMunicipio];
          break;
        case 'nombreEntidad' :
          [propertyA, propertyB] = [a.nombreEntidad, b.nombreEntidad];
          break;
        case 'nombreMunicipio' :
          [propertyA, propertyB] = [a.nombreMunicipio, b.nombreMunicipio];
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
