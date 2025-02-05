import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {Patient} from "@core/models/Patient";
import {PatientByIdMedic} from "@core/models/PatientByIdMedic";

@Injectable({
  providedIn: 'root',
})

export class PatientService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

  constructor(
    private httpClient: HttpClient,
    private readonly gfs: GeneralFunctionsService
  ) {
    super();
  }

  get data(): Patient[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllPatients(idGemp: string): void {
    this.isTblLoading = true;

    this.subs.sink = this.httpClient.get<DefaultResponse<Patient[]>>(
      `${environment.backend_url}Pacientes/ByGEMP/${idGemp}`
    ).subscribe({
      next: (data: DefaultResponse<Patient[]>): void => {
        this.isTblLoading = false;

        const combinado = data.data.map(obj => ({
          ...obj,
          status: 'Activo',
          nombres: `${obj.nombres} ${obj.primerApellido} ${obj.segundoApellido}`
        }));
        this.dataChange.next(combinado);
      },
      error: (error: HttpErrorResponse): void => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudo cargar la información de los pacientes.', error);
      }
    });
  }

  getAllPatientsbyIdDoctor(idDoctor: string): void {
    this.isTblLoading = true;

    this.subs.sink = this.httpClient.get<DefaultResponse<PatientByIdMedic[]>>(
      `${environment.backend_url}Pacientes/ByMedico/${idDoctor}`
    ).subscribe({
      next: (data: DefaultResponse<PatientByIdMedic[]>): void => {
        this.isTblLoading = false;

        const combinado = data.data.map(obj => ({
          ...obj,
          status: 'Activo',
          nombres: `${obj.nombres} ${obj.primerApellido} ${obj.segundoApellido}`
        }));
        this.dataChange.next(combinado);
      },
      error: (): void => {
        this.isTblLoading = false;
      }
    });
  }

  getAllPatientsbyIdBranch(idBranch: string): void {
    this.isTblLoading = true;

    this.subs.sink = this.httpClient.get<DefaultResponse<PatientByIdMedic[]>>(
      `${environment.backend_url}Pacientes/BySucursal/${idBranch}`
    ).subscribe({
      next: (data: DefaultResponse<PatientByIdMedic[]>): void => {
        this.isTblLoading = false;

        const combinado = data.data.map(obj => ({
          ...obj,
          status: 'Activo',
          nombres: `${obj.nombres} ${obj.primerApellido} ${obj.segundoApellido}`
        }));
        this.dataChange.next(combinado);
      },
      error: (error: HttpErrorResponse): void => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudo cargar la información de los pacientes.', error);
      }
    });
  }

  createUpdatePatient(data: Patient, action: string | null) {
    const cleanData = this.gfs.mayusAcentos(data);
    const url = `${environment.backend_url}Pacientes`;

    if (action) {
      return this.httpClient.put<DefaultResponse<string>>(url, cleanData, {responseType: 'text' as 'json'});
    } else {
      return this.httpClient.post<DefaultResponse<string>>(url, cleanData, {responseType: 'text' as 'json'});
    }
  }

  deletePatient(id: string): void {
    this.httpClient.delete(`${environment.backend_url}Pacientes/${id}`, {responseType: 'text'})
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo eliminar el paciente.', error);
        },
      });
  }
}
