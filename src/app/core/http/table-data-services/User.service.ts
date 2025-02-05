import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {UserDetails} from "../../models/UserDetails";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Injectable({
  providedIn: 'root',
})

export class UserService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<UserDetails[]> = new BehaviorSubject<UserDetails[]>([]);

  constructor(private httpClient: HttpClient, private gfs: GeneralFunctionsService) {
    super();

  }

  get data(): UserDetails[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllUsers(idGEMP: string): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<UserDetails[]>>(
      `${environment.backend_url}Usuarios/gemp/${idGEMP}`).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        const filtered = data.data
          .map((value: UserDetails) => ({
            ...value,
            nombres: `${value.nombres} ${value.primerApellido} ${value.segundoApellido}`
          }));
        this.dataChange.next(filtered);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudieron obtener los Usuarios.', error);
      },
    });
  }

  getAllUsersByIdBranch(idBranch: string): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<UserDetails[]>>(
      `${environment.backend_url}Usuarios/sucursal/${idBranch}`).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        const filtered = data.data
          .map((value: UserDetails) => ({
            ...value,
            nombres: `${value.nombres} ${value.primerApellido} ${value.segundoApellido}`
          }));
        this.dataChange.next(filtered);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudieron obtener los Usuarios.', error);
      },
    });
  }

  deleteUser(id: string): void {
    this.httpClient.post(`${environment.backend_url}Usuarios/eliminar-usuario/${id}`, {responseType: 'text'})
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo eliminar el paciente.', error);
        },
      });
  }
}
