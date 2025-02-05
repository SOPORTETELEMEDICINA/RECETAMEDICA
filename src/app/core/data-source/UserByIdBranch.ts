import {DataSource} from "@angular/cdk/collections";
import {UserDetails} from "../models/UserDetails";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {UserService} from "../http/table-data-services/User.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";

export class UserByIdBranch extends DataSource<UserDetails> {
  filterChange = new BehaviorSubject('');
  filteredData: UserDetails[] = [];
  renderedData: UserDetails[] = [];

  constructor(
    public idBranch: string | null,
    public exampleDatabase: UserService,
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
  connect(): Observable<UserDetails[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllUsersByIdBranch(this.idBranch!);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((user: UserDetails) => {
            const searchStr = (
              user.idUsuario +
              user.usr +
              user.idTipoUsuario +
              user.tipoUsuario +
              user.idGEMP +
              user.idSucursal +
              user.nombreSucursal +
              user.nombres +
              user.primerApellido +
              user.segundoApellido +
              user.idAsentamiento +
              user.nombreAsentamiento +
              user.idCP +
              user.codigoPostal +
              user.idMunicipio +
              user.municipio +
              user.domicilio +
              user.movil +
              user.email
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
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
  sortData(data: UserDetails[]): UserDetails[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'nombre':
          [propertyA, propertyB] = [a.nombres, b.nombres];
          break;
        case 'tipo':
          [propertyA, propertyB] = [a.tipoUsuario, b.tipoUsuario];
          break;
        case 'telefono':
          [propertyA, propertyB] = [a.movil, b.movil];
          break;
        case 'direccion':
          [propertyA, propertyB] = [a.domicilio, b.domicilio];
          break;
        case 'municipio':
          [propertyA, propertyB] = [a.municipio, b.municipio];
          break;
        case 'cp':
          [propertyA, propertyB] = [a.codigoPostal, b.codigoPostal];
          break;
        case 'correo':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'asentamiento':
          [propertyA, propertyB] = [a.nombreAsentamiento, b.nombreAsentamiento];
          break;
        case 'sucursal':
          [propertyA, propertyB] = [a.nombreSucursal, b.nombreSucursal];
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

