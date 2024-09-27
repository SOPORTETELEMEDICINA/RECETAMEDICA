import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { DashboardKpiResponse } from '@core/models/Http/Response/DashboardKpiResponse';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private http: HttpClient) {}

  getKpiDoctorBranchManager() {
    return this.http.post<DefaultResponse<DashboardKpiResponse[]>>(
      `${environment.backend_url}Dashboard/GetKPIPacientesRecetas`,
      {}
    );
  }
}
