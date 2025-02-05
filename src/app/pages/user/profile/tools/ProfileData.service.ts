import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {MedicByIdUser} from "@core/models/MedicByIdUser";

@Injectable({
  providedIn: 'root',
})
export class ProfileDataService {

  constructor(private httpClient: HttpClient) {
  }

  /** CRUD METHODS */

  getDoctorByIdUser(idUser: string) {
    return this.httpClient.get<DefaultResponse<MedicByIdUser>>(
      `${environment.backend_url}Medicos/ByIdUsuario/${idUser}`
    );
  }

  updateUser(user: any) {
    return this.httpClient.put(`${environment.backend_url}Usuarios/actualizar`, user, {responseType: 'text' as 'json'});
  }
}
