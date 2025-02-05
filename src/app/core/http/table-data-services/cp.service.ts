import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {BehaviorSubject, forkJoin} from "rxjs";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {PostalCode} from "@core/models/PostalCode";
import {CatService} from "@core/http/cat.service";
import {Township} from "@core/models/Township";

@Injectable({
  providedIn: 'root'
})
export class PostalCodeService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<PostalCode[]> = new BehaviorSubject<PostalCode[]>([]);

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService, private catService: CatService) {
    super();
  }

  get data(): PostalCode[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */

  getPostalCodeByIdEntidad(idEntidad: number, nombreEntidad: string): void {
    if (idEntidad && idEntidad > 0) {
      this.isTblLoading = true;
      const idEntidadStr = idEntidad.toString();

      this.subs.sink = forkJoin({
        municipios: this.catService.getMunicipiosByIdEntidad(idEntidad),
        codigosPostales: this.httpClient.get<DefaultResponse<PostalCode[]>>(
          `${environment.backend_url}Catalogo/cp/byEntidad/${idEntidadStr}`
        )
      }).subscribe({
        next: ({municipios, codigosPostales}) => {
          const municipiosMap = new Map<number, string>();

          municipios.data.forEach((township: Township) => {
            municipiosMap.set(township.idMunicipio, township.nombre);
          });

          const dataConNombre = codigosPostales.data.map(postalCode => ({
            ...postalCode,
            nombreEntidad,
            nombreMunicipio: municipiosMap.get(postalCode.idMunicipio) || ''
          }));

          this.isTblLoading = false;
          this.dataChange.next(dataConNombre);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          this.gfs.showErrorAlert('No se pudieron obtener los datos.', error);
        }
      });
    } else {
      this.isTblLoading = false;
      this.dataChange.next([]);
    }
  }


  getPostalCodeByIdMunicipio(idMunicipio: number, nombreEntidad: string, nombreMunicipio: string): void {
    if (idMunicipio && idMunicipio > 0) {
      const idMunicipioStr = idMunicipio.toString();
      this.subs.sink = this.httpClient.get<DefaultResponse<PostalCode[]>>(
        `${environment.backend_url}Catalogo/cp/byMunicipio/${idMunicipioStr}`,
      ).subscribe({
        next: (data) => {
          data.data.forEach((postalCode: PostalCode) => {
            postalCode.nombreEntidad = nombreEntidad;
            postalCode.nombreMunicipio = nombreMunicipio;
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
