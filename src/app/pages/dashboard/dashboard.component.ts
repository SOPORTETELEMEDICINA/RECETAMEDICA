import {Component, OnInit} from '@angular/core';
import {AuthManagementService} from '@core/service/auth-management.service';
import {UnsubscribeOnDestroyAdapter,} from '@shared';
import {UsersComponent} from "../admin/users/users.component";
import {PatientListComponent} from "../patient/patient-list/patient-list.component";
import {UserRole} from "@core/models/Enums/UserRole";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    UsersComponent,
    PatientListComponent,
  ],
})
export class DashboardComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  userRole: string = ''

  constructor(
    private authManagement: AuthManagementService,
  ) {
    super();
  }

  ngOnInit() {
    const userData = this.authManagement.userData();
    this.userRole = userData.IdRol;
  }

  protected readonly UserRole = UserRole;
}
