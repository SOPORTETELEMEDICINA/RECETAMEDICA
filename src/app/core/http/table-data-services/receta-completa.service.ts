import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IDetalleReceta} from "@core/interfaces/receta-completa";
import {environment} from "@enviroment/environment";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RecetaCompletaService {
  private recetaCompleta: IDetalleReceta[] = [];
  dataChange: BehaviorSubject<IDetalleReceta[]> = new BehaviorSubject<IDetalleReceta[]>(this.recetaCompleta);

  constructor(private http: HttpClient) {
  }

  // noinspection JSUnusedGlobalSymbols
  get data(): IDetalleReceta[] {
    return this.dataChange.value;
  }

  /** CRUD methods */
  addRecetaLine(prescriptionLine: IDetalleReceta): void {
    this.recetaCompleta.push(prescriptionLine);
    this.dataChange.next(this.recetaCompleta);
  }

  postSurtir(data: any) {
    const url = `${environment.backend_url}PuntoVenta/surtir-medicamentos`;
    return this.http.post<DefaultResponse<string>>(url, data)
  }

  resetDataSource(): void {
    this.recetaCompleta = [];
    this.dataChange.next([]);
  }
}
