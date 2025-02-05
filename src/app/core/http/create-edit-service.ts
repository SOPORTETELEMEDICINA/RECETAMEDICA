import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@enviroment/environment';
import {DefaultResponse} from '@core/models/Http/DefaultResponse';
import {UserDetails} from "@core/models/UserDetails";
import {DoctorDetails} from "@core/models/DoctorDetails";
import {PatientDetails} from "@core/models/PatientDetails";
import {MedicByIdUser} from "@core/models/MedicByIdUser";
import {Branch} from "@core/models/Branch";
import {GEMP} from "@core/models/GEMP";

@Injectable({
  providedIn: 'root',
})
export class CreateEditService {
  constructor(private http: HttpClient) {
  }

  getUserById(idGEMP: string | null) {
    return this.http.get<DefaultResponse<UserDetails[]>>(
      `${environment.backend_url}Usuarios/gemp/${idGEMP}`)
  }

  getDoctorByIdUser(idUser: string) {
    return this.http.get<DefaultResponse<DoctorDetails>>(
      `${environment.backend_url}Medicos/ByIdUsuario/${idUser}`
    );
  }

  getDoctorByIdDoctor(idDoctor: string) {
    return this.http.get<DefaultResponse<MedicByIdUser>>(
      `${environment.backend_url}Medicos/ByIdMedico/${idDoctor}`
    );
  }

  getpatientByIdUser(idUser: string) {
    return this.http.get<DefaultResponse<PatientDetails>>(
      `${environment.backend_url}Pacientes/ByIdUsuario/${idUser}`
    );
  }

  getBranchByIdBranch(idBranch: string) {
    return this.http.get<DefaultResponse<Branch>>(
      `${environment.backend_url}Sucursales/${idBranch}`
    );
  }

  getGempbyIdGemp(idGemp: string | null) {
    return this.http.get<DefaultResponse<GEMP>>(
      `${environment.backend_url}CatGrupoEmpresarial/GetGrupoEmpresarialById/${idGemp}`
    );
  }
}
