import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { UserDetails } from '@core/models/UserDetails';
import { Doctor } from '@core/models/Doctor';
import { CreateUserResponse } from '@core/models/Http/Response/CreateUserResponse';
import {Patient} from "@core/models/Patient";
import {PatientDetails} from "@core/models/PatientDetails";

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

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
    const typeRequest = data.idUsuario ? `${data.idUsuario}` : `crear`;
    const url = `${environment.backend_url}Usuarios/${typeRequest}`;

    return data.idUsuario
      ? this.http.put<DefaultResponse<CreateUserResponse>>(url, data)
      : this.http.post<DefaultResponse<CreateUserResponse>>(url, data);
  }

  createUpdateDoctor(data: Doctor) {
    const typeRequest = data.idMedico ? `/${data.idMedico}` : ``;
    const url = `${environment.backend_url}Medicos${typeRequest}`;

    return this.http.post<DefaultResponse<string>>(url, data);
  }

  createUpdatePatient(data: Patient) {
    const typeRequest = data.idPaciente ? `/${data.idPaciente}` : ``;
    const url = `${environment.backend_url}Pacientes${typeRequest}`;

    return this.http.post<DefaultResponse<string>>(url, data);
  }
}
