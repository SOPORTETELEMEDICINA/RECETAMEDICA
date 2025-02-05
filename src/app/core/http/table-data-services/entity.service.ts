import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {BehaviorSubject} from "rxjs";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {Entity} from "@core/models/Entity";

@Injectable({
  providedIn: 'root'
})
export class EntityService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Entity[]> = new BehaviorSubject<Entity[]>([]);

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService) {
    super();
  }

  get data(): Entity[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllEntities(): void {
    this.subs.sink = this.httpClient.get<DefaultResponse<Entity[]>>(
      `${environment.backend_url}Catalogo/entidades`,).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        this.gfs.showErrorAlert('No se pudieron obtener las Entidades.', error)
      },
    });
  }
}
