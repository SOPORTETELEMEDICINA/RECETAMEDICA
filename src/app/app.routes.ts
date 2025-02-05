import {Route} from '@angular/router';
import {MainLayoutComponent} from './layout/app-layout/main-layout/main-layout.component';
import {AuthGuard} from '@core/guard/auth.guard';
import {AuthLayoutComponent} from './layout/app-layout/auth-layout/auth-layout.component';
import {Page404Component} from './authentication/page404/page404.component';
import {ForgotPasswordComponent} from './authentication/forgot-password/forgot-password.component';
import {Page500Component} from './authentication/page500/page500.component';
import {SigninComponent} from './authentication/signin/signin.component';
import {ResetPasswordComponent} from './authentication/reset-password/reset-password.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {UsersComponent} from './pages/admin/users/users.component';
import {ProfileComponent} from './pages/user/profile/profile.component';
import {BranchListComponent} from './pages/branch/branch-list/branch-list.component';
import {PatientListComponent} from './pages/patient/patient-list/patient-list.component';
import {PrescriptionListComponent} from './pages/prescription/prescription-list/prescription-list.component';
import {DoctorListComponent} from './pages/doctor/doctor-list/doctor-list.component';
import {
  PrescriptionEditCreateComponent
} from './pages/prescription/prescription-list/prescription-edit-create/prescription-edit-create.component';
import {CatalogsComponent} from "./pages/catalogs/catalogs-list/catalogs.component";
import {ReportsComponent} from "./pages/reports/reports-list/reports.component";
import {CatalogsV2Component} from "./pages/catalogs/catalogs-list-v2/catalogs-v2.component";
import {DoctorEditCreateComponent} from "./pages/doctor/doctor-list/doctor-edit-create/doctor-edit-create.component";
import {
  PatientCreateEditComponent
} from "./pages/patient/patient-list/patient-create-edit/patient-create-edit.component";
import {PatientProfileComponent} from "./pages/patient/patient-list/patient-profile/patient-profile.component";
import {UserEditCreateComponent} from "./pages/admin/users/user-edit-create/user-edit-create.component";
import {UserProfileComponent} from "./pages/admin/users/user-profile/user-profile.component";
import {DoctorProfileComponent} from "./pages/doctor/doctor-list/doctor-profile/doctor-profile.component";
import {BranchEditCreateComponent} from "./pages/branch/branch-list/branch-edit-create/branch-edit-create.component";
import {BranchProfileComponent} from "./pages/branch/branch-list/branch-profile/branch-profile.component";
import {PrescriptionSupplyComponent} from "./pages/prescription/prescription-supply/prescription-supply.component";

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {
        path: '',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
        ],
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'user-list',
            component: UsersComponent,
          },
          {
            path: 'create-edit',
            component: UserEditCreateComponent,
          },
          {
            path: 'create-edit/:param/:gid',
            component: UserEditCreateComponent,
          },
          {
            path: 'profile/:param/:gid',
            component: UserProfileComponent,
          },
        ],
      },
      {
        path: 'branch',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'branch-list',
            component: BranchListComponent,
          },
          {
            path: 'create-edit/:gid',
            component: BranchEditCreateComponent,
          },
          {
            path: 'create-edit/:gid/:param',
            component: BranchEditCreateComponent,
          },
          {
            path: 'profile/:gid/:param',
            component: BranchProfileComponent,
          },
        ],
      },
      {
        path: 'doctor',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'doctor-list',
            component: DoctorListComponent,
          },
          {
            path: 'create-edit',
            component: DoctorEditCreateComponent,
          },
          {
            path: 'create-edit/:param',
            component: DoctorEditCreateComponent,
          },
          {
            path: 'profile/:param',
            component: DoctorProfileComponent,
          },
        ],
      },
      {
        path: 'patient',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'patient-list',
            component: PatientListComponent,
          },
          {
            path: 'create-edit',
            component: PatientCreateEditComponent,
          },
          {
            path: 'create-edit/:param',
            component: PatientCreateEditComponent,
          },
          {
            path: 'profile/:param',
            component: PatientProfileComponent,
          },
        ],
      },
      {
        path: 'catalogs',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'catalogs-list',
            component: CatalogsComponent,
          },
          {
            path: 'catalogs-list-v2',
            component: CatalogsV2Component,
          },
        ],
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'reports-list',
            component: ReportsComponent,
          },
        ],
      },
      {
        path: 'prescription',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'prescription-list',
            component: PrescriptionListComponent,
          },
          {
            path: 'prescription-supply',
            component: PrescriptionSupplyComponent,
          },
          {
            path: 'create',
            component: PrescriptionEditCreateComponent,
          },
        ],
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'profile',
            component: ProfileComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'signin',
        pathMatch: 'full',
      },
      {
        path: 'signin',
        component: SigninComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'page404',
        component: Page404Component,
      },
      {
        path: 'page500',
        component: Page500Component,
      },
      {
        path: 'reset/:token',
        component: ResetPasswordComponent,
      },
    ],
  },
  {path: '**', component: Page404Component},
];
