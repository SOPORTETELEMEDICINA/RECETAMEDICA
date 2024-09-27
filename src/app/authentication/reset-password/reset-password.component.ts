import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { AuthService } from '@core/http/auth.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    NgIf,
  ],
})
export class ResetPasswordComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  hide = true;
  chide = true;

  password: string = '';
  confirmedPassword: string = '';
  token: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authSevice: AuthService
  ) {
    this.route.params.subscribe((param) => {
      this.token = param['token'];
    });
  }

  ngOnInit() {}

  resetPassword() {
    this.authSevice
      .resetPassword(this.token, this.password, this.confirmedPassword)
      .subscribe({
        next: (res: DefaultResponse<string>) => {
          console.log(res);

          Swal.fire({
            icon: 'success',
            html: res.message,
          }).then(() => {
            this.router.navigate(['/authentication/signin']);
          });
        },
      });
  }
}
