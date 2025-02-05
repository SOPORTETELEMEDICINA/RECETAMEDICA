import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {Branch} from "@core/models/Branch";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {CreateUserResponse} from "@core/models/Http/Response/CreateUserResponse";

@Injectable({
  providedIn: 'root',
})

export class BranchService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Branch[]> = new BehaviorSubject<Branch[]>([]);

  constructor(private httpClient: HttpClient, private gfs: GeneralFunctionsService) {
    super();

  }

  get data(): Branch[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllBranches(idGEMP: string): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<Branch[]>>(
      `${environment.backend_url}Sucursales/gemp/${idGEMP}`
    ).subscribe({
      next: (data) => {
        this.isTblLoading = false;

        const filtered = data.data.map((value: Branch) => {
          const newBranch = {...value, calle1: '', calle2: '', calle3: ''};

          if (newBranch.domicilio) {
            const direccion = newBranch.domicilio.split(',').map(part => part.trim());

            newBranch.calle1 = direccion[0] || '';
            newBranch.calle2 = direccion.slice(1, direccion.length - 1).join(', ') || '';
            newBranch.calle3 = direccion[direccion.length - 1] || '';
          }

          return newBranch;
        });

        this.dataChange.next(filtered);
      },
      error: () => {
        this.isTblLoading = false;
      },
    });
  }

  createUpdateUser(data: Branch, idSucursal?: string | null) {
    const typeRequest = data.idGEMP ? `` : `/${idSucursal}`;
    const url = `${environment.backend_url}Sucursales${typeRequest}`;

    const cleanData = this.gfs.mayusAcentos(data);

    return !cleanData.idGEMP
      ? this.httpClient.put<DefaultResponse<CreateUserResponse>>(url, cleanData)
      : this.httpClient.post<DefaultResponse<CreateUserResponse>>(url, cleanData);
  }

  deleteBranch(id: string): void {
    this.httpClient.delete(`${environment.backend_url}Sucursales/${id}`, {responseType: 'text'})
      .subscribe({
        next: () => {
        },
        error: (error: HttpErrorResponse) => {
          this.gfs.showErrorAlert('No se pudo eliminar la Sucursal.', error);
        },
      });
  }

}
