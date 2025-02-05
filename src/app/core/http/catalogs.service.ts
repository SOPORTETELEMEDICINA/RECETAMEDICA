import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@enviroment/environment';
import {Settlement} from '@core/models/Settlement';
import {UserType} from '@core/models/UserType';
import {BusinessGroup} from '@core/models/BusinessGroup';
import {Branch} from '@core/models/Branch';
import {DefaultResponse} from '@core/models/Http/DefaultResponse';
import {FederalEntity} from '@core/models/FederalEntity';
import {Allergy} from '@core/models/Allergy';
import {Patology} from '@core/models/Patology';
import {Molecule} from "@core/models/Molescule";
import {Medicament} from "@core/models/Medicament";
import {PatientDetails} from "@core/models/PatientDetails";
import {GEMP} from "@core/models/GEMP";

@Injectable({
  providedIn: 'root',
})
export class CatalogsService {
  constructor(private http: HttpClient) {
  }

  getSettlementByPostalCode(name: string) {
    return this.http.get<DefaultResponse<Settlement[]>>(
      `${environment.backend_url}Consulta/AsentamientoByNames?NombreAsentamiento=${name}`
    );
  }

  getUserTypes() {
    return this.http.get<DefaultResponse<UserType[]>>(
      `${environment.backend_url}TipoUsuario/GetAllTipoUsuario`
    );
  }

  getFederalEntitys() {
    return this.http.get<DefaultResponse<FederalEntity[]>>(
      `${environment.backend_url}Pacientes/entidades-federativas`
    );
  }

  getBusinessGroups() {
    return this.http.get<DefaultResponse<BusinessGroup[]>>(
      `${environment.backend_url}CatGrupoEmpresarial/GetAllGrupoEmpresarial`
    );
  }

  getBranchesByIdGEMP(idGEMP: string) {
    return this.http.get<DefaultResponse<Branch[]>>(
      `${environment.backend_url}Sucursales/gemp/${idGEMP}`
    );
  }

  getAllergiesByName(name: string) {
    return this.http.post<DefaultResponse<Allergy[]>>(
      `${environment.backend_url}Consulta/AllergyByName?name=${name}`, {}
    );
  }

  getMolesculesByName(name: string) {
    return this.http.post<DefaultResponse<Molecule[]>>(
      `${environment.backend_url}Consulta/MoleculeByName?name=${name}`, {}
    );
  }

  getPatologiessByName(name: string) {
    return this.http.post<DefaultResponse<Patology[]>>(
      `${environment.backend_url}Consulta/Cim10ByName?name=${name}`, {}
    );
  }

  getMedicamentsByName(name: string) {
    return this.http.post<DefaultResponse<Medicament[]>>(
      `${environment.backend_url}Consulta/MedicamentoByName?name=${name}`, {}
    );
  }

  getPatientsByName(name: string) {
    return this.http.post<DefaultResponse<PatientDetails[]>>(
      `${environment.backend_url}Consulta/PacienteByName?pacientName=${name}`, {}
    );
  }

  getGempbyIdGemp(idGemp: string | null) {
    return this.http.get<DefaultResponse<GEMP>>(
      `${environment.backend_url}CatGrupoEmpresarial/GetGrupoEmpresarialById/${idGemp}`
    );
  }

  getRecetaByIdReceta(idReceta: string, idPaciente: string) {
    const data = {idReceta, idPaciente};

    return this.http.post(`${environment.backend_url}Recetas/GetRecetaByIdReceta`, data, {
      responseType: 'text'
    });
  }
}
