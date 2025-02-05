import {DataSource} from "@angular/cdk/collections";
import {Doctor} from "@core/models/Doctor";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {DoctorService} from "@core/http/table-data-services/Doctor.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map} from "rxjs/operators";

export class DoctorDataSource extends DataSource<Doctor> {
  filterChange = new BehaviorSubject('');
  filteredData: Doctor[] = [];
  renderedData: Doctor[] = [];

  constructor(
    public businessGroupId: string | null,
    public data: DoctorService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public idSucursal: string
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
  connect(): Observable<Doctor[]> {
    const displayDataChanges = [
      this.data.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.idSucursal ? this.data.getAllDoctorsByIdBranch(this.idSucursal!) : this.data.getAllDoctors(this.businessGroupId!);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.data.data
          .slice()
          .filter((doctor: Doctor) => {
            const searchStr = (
              doctor.idMedico +
              doctor.idUsuario +
              doctor.cedulaGeneral +
              doctor.universidad +
              doctor.especialidad +
              doctor.cedulaEspecialidad +
              doctor.horario +
              doctor.nombres +
              doctor.primerApellido +
              doctor.segundoApellido +
              doctor.movil +
              doctor.email +
              doctor.domicilio +
              doctor.idAsentamiento +
              doctor.asentamiento +
              doctor.tipoAsentamiento +
              doctor.idCP +
              doctor.codigoPostal +
              doctor.idMunicipio +
              doctor.municipio +
              doctor.idCiudad +
              doctor.ciudad +
              doctor.idEntidad +
              doctor.estado
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
  sortData(data: Doctor[]): Doctor[] {
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
        case 'especialidad':
          [propertyA, propertyB] = [a.especialidad, b.especialidad];
          break;
        case 'cedula':
          [propertyA, propertyB] = [a.cedulaGeneral, b.cedulaGeneral];
          break;
        case 'telefono':
          [propertyA, propertyB] = [a.movil, b.movil];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'asentamiento':
          [propertyA, propertyB] = [a.asentamiento, b.asentamiento];
          break;
        case 'cp':
          [propertyA, propertyB] = [a.codigoPostal, b.codigoPostal];
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
