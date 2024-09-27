import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@enviroment/environment';
import { UserRole } from '@core/models/Enums/UserRole';

@Injectable({
  providedIn: 'root',
})
export class AuthManagementService {
  constructor(public jwtHelper: JwtHelperService) {}

  saveUserToken(token: string): void {
    localStorage.setItem(environment.token_name, token);
  }

  public isAuthenticated(): boolean {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  public isUserAdmin(): boolean {
    const userData = this.userData();

    return userData.IdRol == UserRole.Admin;
  }

  public isUserDoctor(): boolean {
    const userData = this.userData();

    return userData.IdRol == UserRole.Medico;
  }

  public isUserPharmacySupervision() {
    const userData = this.userData();

    return userData.IdRol == UserRole.Supervisor_Sucursales;
  }

  public isUserPharmacyResponsible() {
    const userData = this.userData();

    return userData.IdRol == UserRole.Responsable_Farmacia;
  }

  public userData() {
    return this.jwtHelper.decodeToken(String(this.getToken()));
  }

  public logout(): void {
    localStorage.removeItem(environment.token_name);
  }

  public getToken(): string | null {
    return localStorage.getItem(environment.token_name);
  }
}
