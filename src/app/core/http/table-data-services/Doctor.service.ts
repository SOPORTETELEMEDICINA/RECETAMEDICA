import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {Doctor} from "@core/models/Doctor";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Injectable({
  providedIn: 'root',
})

export class DoctorService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Doctor[]> = new BehaviorSubject<Doctor[]>([]);

  constructor(private httpClient: HttpClient, private gfs: GeneralFunctionsService) {
    super();
  }

  get data(): Doctor[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllDoctors(idGEMP: string): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<Doctor[]>>(
      `${environment.backend_url}Medicos/ByGEMP/${idGEMP}`,).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        const combined = data.data.map((value: Doctor) => ({
          ...value,
          nombres: `${value.nombres} ${value.primerApellido} ${value.segundoApellido}`
        }));

        this.dataChange.next(combined);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('Error al obtener loas Medicos.', error);
      },
    });
  }

  getAllDoctorsByIdBranch(idBranch: string): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<Doctor[]>>(
      `${environment.backend_url}Medicos/BySucursal/${idBranch}`,).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        const combined = data.data.map((value: Doctor) => ({
          ...value,
          nombres: `${value.nombres} ${value.primerApellido} ${value.segundoApellido}`
        }));

        this.dataChange.next(combined);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('Error al obtener loas Medicos.', error);
      },
    });
  }

  deleteMedic(id: string): void {
    this.httpClient.delete(`${environment.backend_url}Medicos/${id}`, {responseType: 'text'})
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo eliminar el Medico.', error);
        },
      });
  }
}
