import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthManagementService } from '@core/service/auth-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authManagement: AuthManagementService,
    private router: Router
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authManagement.isAuthenticated()) {
      this.router.navigate(['/authentication/signin']);

      return false;
    }
    return true;
  }
}
