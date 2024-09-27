import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '@core/http/auth.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgIf,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {}

  sendResetPasswordEmail() {
    if (!this.email) return;

    this.authService.sendResetPasswordEmail(this.email).subscribe({
      next: (res: DefaultResponse<string>) => {
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
