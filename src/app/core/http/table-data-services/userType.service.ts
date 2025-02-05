import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {UserType} from "@core/models/UserType";


@Injectable({
  providedIn: 'root',
})

export class UserTypeService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<UserType[]> = new BehaviorSubject<UserType[]>([]);
  dialogData!: UserType;

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService) {
    super();

  }

  get data(): UserType[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllUserTypes(): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<UserType[]>>(
      `${environment.backend_url}TipoUsuario/GetAllTipoUsuario`,).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudieron obtener los Tipos de usuario.', error)
      },
    });
  }

  addUserType(userType: UserType): void {

    userType.idTipoUsuario = this.gfs.generateUUID()

    const cleanData = this.gfs.mayusAcentos(userType);

    this.httpClient.post(`${environment.backend_url}TipoUsuario/CreateTipoUsuario`, cleanData)
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo crear el Tipo de usuario.', error)
        },
      });
  }

  updateUserType(userType: UserType): void {

    const cleanData = this.gfs.mayusAcentos(userType);

    this.httpClient.put(`${environment.backend_url}TipoUsuario/UpdateTipoUsuario`, cleanData)
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo actualizar el Tipo de usuario..', error)
        },
      });
  }

}
