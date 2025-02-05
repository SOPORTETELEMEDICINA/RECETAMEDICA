import {Injectable} from '@angular/core';
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {BehaviorSubject, forkJoin} from "rxjs";
import {Prescription} from "@core/models/Prescription";
import {FilterReceta} from "@core/models/FilterReceta";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {PrescriptionData} from "@core/models/PrescriptionData";
import {map} from "rxjs/operators";
import {RecetaCompleta} from "@core/interfaces/receta-completa";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<PrescriptionData[]> = new BehaviorSubject<PrescriptionData[]>([]);

  constructor(private httpClient: HttpClient, private gfs: GeneralFunctionsService) {
    super();
  }

  get data(): PrescriptionData[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllprescriptions(prescriptions: Prescription[]): void {
    if (prescriptions && prescriptions.length > 0) {
      const requests = prescriptions.map((prescription) =>
        this.httpClient.get<DefaultResponse<PrescriptionData>>(
          `${environment.backend_url}Consulta/ConsultarReceta/${prescription.idReceta}`
        ).pipe(
          map((response) => {
            const formattedFechaCreacion = prescription.fechaCreacion.split('T')[0];
            const edad = this.calculateAge(response.data.receta.fechaNacimientoPaciente);

            return {
              ...response.data,
              receta: {
                ...response.data.receta,
                fechaCreacion: formattedFechaCreacion,
                edad: edad
              },
            };
          })
        )
      );
      this.subs.sink = forkJoin(requests).subscribe({
        next: (combinedData: PrescriptionData[]) => {
          this.isTblLoading = false;
          this.dataChange.next(combinedData);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          this.gfs.showErrorAlert('No se pudieron obtener los datos de las recetas.', error);
        },
      });
    } else {
      this.isTblLoading = false;
      this.dataChange.next([]);
    }
  }

  getAllprescriptionsData(filterReceta: FilterReceta) {
    return this.httpClient.post<DefaultResponse<Prescription[]>>(
      `${environment.backend_url}Recetas/GetFilteredRecetas`, filterReceta);
  }

  getPrescriptionById(prescriptionId: string) {
    return this.httpClient.get<DefaultResponse<RecetaCompleta>>(
      `${environment.backend_url}PuntoVenta/consultar-receta/${prescriptionId}`,);
  }

  private calculateAge(fechaNacimiento: string): number {
    if (!fechaNacimiento) {
      return 0;
    }
    const birthDate = new Date(fechaNacimiento.split('T')[0]);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  deletePrescription(id: string): void {
    this.httpClient.delete(`${environment.backend_url}Consulta/EliminarReceta/${id}`, {responseType: 'text'})
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo eliminar la Sucursal.', error);
        },
      });
  }
}
