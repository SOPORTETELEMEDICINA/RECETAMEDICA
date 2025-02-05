import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule,} from '@angular/forms';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {AuthService} from '@core/http/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {AuthLoginRequest} from '@core/models/Http/Request/AuthLoginRequest';
import {NgIf} from '@angular/common';
import {AuthManagementService} from '@core/service/auth-management.service';
import {DefaultResponse} from '@core/models/Http/DefaultResponse';
import {AuthLoginResponse} from '@core/models/Http/Response/AuthLoginResponse';
import Swal from 'sweetalert2';
import {BusinessGroupService} from '@core/service/business-group.service';
import {UserService} from "@core/service/user.service";

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
  implements OnInit {
  error = '';
  hide = true;

  user: AuthLoginRequest;

  constructor(
    private authService: AuthService,
    private authManagement: AuthManagementService,
    private businessGropupService: BusinessGroupService,
    private userService: UserService,
    private router: Router
  ) {
    super();

    this.user = new AuthLoginRequest();
  }

  ngOnInit() {
  }

  login() {
    if (!this.user.usr || !this.user.password) return;

    this.authService.login(this.user).subscribe({
      next: (res: DefaultResponse<AuthLoginResponse>) => {
        this.authManagement.saveUserToken(res.data.token);
        this.businessGropupService.setBusinessGroupId(
          res.data.userDetails.idGEMP
        );
        localStorage.setItem('userDetails', JSON.stringify(res.data.userDetails));

        this.userService.setUserName(res.data.userDetails.nombres.split(' ')[0] + ' ' + res.data.userDetails.primerApellido)
        this.router.navigate(['/dashboard']).then();

        Swal.fire({
          icon: 'success',
          html: `Bienvenido ${res.data.userDetails.nombres}`,
        }).then();
      },
    });
  }
}
