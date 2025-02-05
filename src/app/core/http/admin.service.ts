// noinspection JSUnusedGlobalSymbols

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@enviroment/environment';
import {DefaultResponse} from '@core/models/Http/DefaultResponse';
import {UserDetails} from '@core/models/UserDetails';
import {Doctor} from '@core/models/Doctor';
import {CreateUserResponse} from '@core/models/Http/Response/CreateUserResponse';
import {PatientDetails} from "@core/models/PatientDetails";
import {ImageSignature} from "@core/models/ImageSignature";
import {of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient, private gfs: GeneralFunctionsService) {
  }

  getUsers() {
    return this.http.post<DefaultResponse<UserDetails[]>>(
      `${environment.backend_url}Usuarios/obtener-usuarios`,
      {}
    );
  }

  getPatients() {
    return this.http.post<DefaultResponse<PatientDetails[]>>(
      `${environment.backend_url}Medicos/pacientes-por-sucursal`,
      {}
    );
  }

  createUpdateUser(data: UserDetails) {
    const cleanData = this.gfs.mayusAcentos(data);

    const typeRequest = cleanData.idUsuario ? `actualizar` : `crear`;
    const url = `${environment.backend_url}Usuarios/${typeRequest}`;

    return cleanData.idUsuario
      ? this.http.put<DefaultResponse<CreateUserResponse>>(url, cleanData)
      : this.http.post<DefaultResponse<CreateUserResponse>>(url, cleanData);
  }

  createUpdateDoctor(data: Doctor) {

    const cleanData = this.gfs.mayusAcentos(data);

    const url = `${environment.backend_url}Medicos`;

    if (cleanData.idMedico) {
      return this.http.put<DefaultResponse<string>>(url, cleanData).pipe(
        map(() => {
          return {success: true, message: 'Actualización exitosa', cleanData: ''};
        }),
        catchError(() => {
          return of({success: true, message: 'Pasa en la actualización', cleanData: ''});
        })
      );
    }

    return this.http.post<DefaultResponse<string>>(url, cleanData);
  }

  uploadImages(data: ImageSignature) {
    const url = `${environment.backend_url}Usuarios/imagen-firma`;

    return this.http.post<DefaultResponse<string>>(url, data);
  }

}
