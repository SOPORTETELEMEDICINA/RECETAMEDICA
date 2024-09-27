import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AuthService } from '@core/http/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AuthLoginRequest } from '@core/models/Http/Request/AuthLoginRequest';
import { NgIf } from '@angular/common';
import { AuthManagementService } from '@core/service/auth-management.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { AuthLoginResponse } from '@core/models/Http/Response/AuthLoginResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
  ],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  error = '';
  hide = true;

  user: AuthLoginRequest;

  constructor(
    private authService: AuthService,
    private authManagement: AuthManagementService,
    private router: Router
  ) {
    super();

    this.user = new AuthLoginRequest();
  }

  ngOnInit() {}

  login() {
    if (!this.user.usr || !this.user.password) return;

    this.authService.login(this.user).subscribe({
      next: (res: DefaultResponse<AuthLoginResponse>) => {
        this.authManagement.saveUserToken(res.data.token);
        this.router.navigate(['/dashboard']);

        Swal.fire({
          icon: 'success',
          html: `Bienvenido ${res.data.userDetails.nombres}`,
        });
      },
    });
  }
}
