import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {Diagnostic} from "@core/models/Diagnostic";


@Injectable({
  providedIn: 'root',
})

export class DiagnosticService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Diagnostic[]> = new BehaviorSubject<Diagnostic[]>([]);

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService) {
    super();
  }

  get data(): Diagnostic[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllDiagnostics(name: string): void {
    if (name) {
      this.subs.sink = this.httpClient.post<DefaultResponse<Diagnostic[]>>(
        `${environment.backend_url}Consulta/CIM10ByName?name=${name}`, {}).subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data.data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          this.gfs.showErrorAlert('No se pudieron obtener los Diagnosticos.', error)
        },
      });
    } else {
      this.isTblLoading = false;
      this.dataChange.next([]);
    }
  }
}
