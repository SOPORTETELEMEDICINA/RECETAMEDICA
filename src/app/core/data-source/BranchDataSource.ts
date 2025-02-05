import {DataSource} from "@angular/cdk/collections";
import {Branch} from "@core/models/Branch";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {BranchService} from "@core/http/table-data-services/Branch.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";

export class BranchDataSource extends DataSource<Branch> {
  filterChange = new BehaviorSubject('');
  filteredData: Branch[] = [];
  renderedData: Branch[] = [];

  constructor(
    public businessGroupId: string | null,
    public exampleDatabase: BranchService,
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

  /** Connect function domiciliod by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Branch[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllBranches(this.businessGroupId!);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((branch: Branch) => {
            const searchStr = (
              branch.idSucursal +
              branch.nombre +
              branch.registroSanitario +
              branch.responsable +
              branch.cedulaResponsable +
              branch.telefonoResponsable +
              branch.emailResponsable +
              branch.domicilio +
              branch.idAsentamiento +
              branch.nombreAsentamiento +
              branch.tipoAsentamiento +
              branch.ciudad +
              branch.codigoPostal +
              branch.municipio +
              branch.estado +
              branch.abreviatura +
              branch.status
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
  sortData(data: Branch[]): Branch[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'nombre':
          [propertyA, propertyB] = [a.nombre, b.nombre];
          break;
        case 'registroSanitario':
          [propertyA, propertyB] = [a.registroSanitario, b.registroSanitario];
          break;
        case 'responsable':
          [propertyA, propertyB] = [a.responsable, b.responsable];
          break;
        case 'cedulaResponsable':
          [propertyA, propertyB] = [a.cedulaResponsable, b.cedulaResponsable];
          break;
        case 'telefonoResponsable':
          [propertyA, propertyB] = [a.telefonoResponsable, b.telefonoResponsable];
          break;
        case 'emailResponsable':
          [propertyA, propertyB] = [a.emailResponsable, b.emailResponsable];
          break;
        case 'domicilio':
          [propertyA, propertyB] = [a.domicilio, b.domicilio];
          break;
        case 'status':
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


