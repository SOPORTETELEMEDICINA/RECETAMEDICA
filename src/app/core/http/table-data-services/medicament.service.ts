import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {environment} from "@enviroment/environment";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {Medicament} from "@core/models/Medicament";


@Injectable({
  providedIn: 'root',
})

export class MedicamentService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Medicament[]> = new BehaviorSubject<Medicament[]>([]);

  constructor(private httpClient: HttpClient, private readonly gfs: GeneralFunctionsService) {
    super();
  }

  get data(): Medicament[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllMedicaments(name: string): void {
    if (name) {
      this.subs.sink = this.httpClient.post<DefaultResponse<Medicament[]>>(
        `${environment.backend_url}Consulta/MedicamentoByName?name=${name}`, {}).subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data.data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          this.gfs.showErrorAlert('No se pudieron obtener los Medicamentos.', error)
        },
      });
    } else {
      this.isTblLoading = false;
      this.dataChange.next([]);
    }
  }
}
