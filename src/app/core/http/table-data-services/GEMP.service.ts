import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {GEMP} from "@core/models/GEMP";


@Injectable({
  providedIn: 'root',
})

export class GEMPService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<GEMP[]> = new BehaviorSubject<GEMP[]>([]);
  dialogData!: GEMP;

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService) {
    super();

  }

  get data(): GEMP[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllGEMPs(): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<GEMP[]>>(
      `${environment.backend_url}CatGrupoEmpresarial/GetAllGrupoEmpresarial`,).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudieron obtener los Grupos Empresariales.', error)
      },
    });
  }

  addGEMP(gemp: GEMP): void {
    const cleanData = this.gfs.mayusAcentos(gemp);
    cleanData.idGEMP = this.gfs.generateUUID()

    this.httpClient.post(`${environment.backend_url}CatGrupoEmpresarial/CreateGrupoEmpresarial`, cleanData)
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo crear el Grupo Empresarial.', error)
        },
      });
  }

  updateGEMP(gemp: GEMP): void {
    const cleanData = this.gfs.mayusAcentos(gemp);

    this.httpClient.put(`${environment.backend_url}CatGrupoEmpresarial/updateGrupoEmpresarial`, cleanData)
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo actualizar el Grupo Empresarial..', error)
        },
      });
  }

}
