import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthManagementService } from '@core/service/auth-management.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authManagement: AuthManagementService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log(err);

        Swal.fire({
          title: 'Error ' + err.status,
          html: err.error.message,
        });

        if (err.status === 401) {
          if (!window.location.href.includes('/authentication/')) {
            // auto logout if 401 response returned from api
            this.authManagement.logout();
            this.router.navigate(['/authentication/signin']);
          }
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
