import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { AuthLoginRequest } from '@core/models/Http/Request/AuthLoginRequest';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { AuthLoginResponse } from '@core/models/Http/Response/AuthLoginResponse';
import { UserDetails } from '@core/models/UserDetails';
import { Branch } from '@core/models/Branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private http: HttpClient) {}

  getAllBranches() {
    return this.http.post<DefaultResponse<Branch[]>>(
      `${environment.backend_url}Usuarios/get-sucursales`,
      {}
    );
  }
}
