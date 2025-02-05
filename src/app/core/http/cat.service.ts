import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {Entity} from "@core/models/Entity";
import {environment} from "@enviroment/environment";
import {Township} from "@core/models/Township";

@Injectable({
  providedIn: 'root'
})
export class CatService {

  constructor(private http: HttpClient) {
  }

  getEntities() {
    return this.http.get<DefaultResponse<Entity[]>>(
      `${environment.backend_url}Catalogo/entidades`
    );
  }

  getMunicipiosByIdEntidad(idEntidad: number) {
    const idEntidadStr = idEntidad.toString();
    return this.http.get<DefaultResponse<Township[]>>(
      `${environment.backend_url}Catalogo/municipiosbyEntidad/${idEntidadStr}`
    );
  }
}
