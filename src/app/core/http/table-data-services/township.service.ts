import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {BehaviorSubject} from "rxjs";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {Township} from "@core/models/Township";

@Injectable({
  providedIn: 'root'
})
export class TownshipService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Township[]> = new BehaviorSubject<Township[]>([]);

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService) {
    super();
  }

  get data(): Township[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */

  getTownshipByIdEntidad(idEntidad: number, nombreEntidad: string): void {
    if (idEntidad && idEntidad > 0) {
      const idEntidadStr = idEntidad.toString();
      this.subs.sink = this.httpClient.get<DefaultResponse<Township[]>>(
        `${environment.backend_url}Catalogo/municipiosbyEntidad/${idEntidadStr}`,
      ).subscribe({
        next: (data) => {
          data.data.forEach((town: Township) => {
            town.nombreEntidad = nombreEntidad;
          })
          this.isTblLoading = false;
          this.dataChange.next(data.data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          this.gfs.showErrorAlert('No se pudieron obtener los Códigos Postales.', error);
        },
      });
    } else {
      this.isTblLoading = false;
      this.dataChange.next([]);
    }
  }

}
