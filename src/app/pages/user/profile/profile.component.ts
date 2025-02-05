import {Component, OnInit} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {BreadcrumbComponent} from '@shared/components/breadcrumb/breadcrumb.component';
import {AuthManagementService} from "@core/service/auth-management.service";
import {FormsModule} from "@angular/forms";
import {UserRole} from "@core/models/Enums/UserRole";
import {ProfileDoctorComponent} from "./profile-doctor/profile-doctor.component";
import {ProfileUserComponent} from "./profile-user/profile-user.component";
import {ProfilePatientComponent} from "./profile-patient/profile-patient.component";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
    imports: [
        BreadcrumbComponent,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        FormsModule,
        ProfileDoctorComponent,
        ProfileUserComponent,
        ProfilePatientComponent,
        TopWidgetsComponent,
    ],
})
export class ProfileComponent implements OnInit {
  idUsuario: string = '';
  tipoUsuario: string = '';
  idGemp: string = '';
  protected readonly UserRole = UserRole;

  constructor(
    private readonly authManagement: AuthManagementService,
  ) {
    const userData = this.authManagement.userData();
    this.idUsuario = userData.IdUsuario;
    this.tipoUsuario = userData.IdRol;
    this.idGemp = userData.GEMP;
  }

  ngOnInit(): void {
  }
}
