import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment/environment';
import { AuthLoginRequest } from '@core/models/Http/Request/AuthLoginRequest';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { AuthLoginResponse } from '@core/models/Http/Response/AuthLoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data: AuthLoginRequest) {
    return this.http.post<DefaultResponse<AuthLoginResponse>>(
      `${environment.backend_url}Auth/login`,
      data
    );
  }

  sendResetPasswordEmail(email: string) {
    const data = {
      email,
    };

    return this.http.post<DefaultResponse<string>>(
      `${environment.backend_url}Auth/forgot-password`,
      data
    );
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string) {
    const data = {
      token,
      newPassword,
      confirmPassword,
    };

    return this.http.post<DefaultResponse<string>>(
      `${environment.backend_url}Auth/reset-password`,
      data
    );
  }
}
