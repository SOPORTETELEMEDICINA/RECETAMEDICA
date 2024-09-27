import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { Page500Component } from './authentication/page500/page500.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { BranchListComponent } from './pages/branch/branch-list/branch-list.component';
import { PatientListComponent } from './pages/patient/patient-list/patient-list.component';
import { PrescriptionListComponent } from './pages/prescription/prescription-list/prescription-list.component';
import { DoctorListComponent } from './pages/doctor/doctor-list/doctor-list.component';
import { PatientProfileComponent } from './pages/patient/patient-profile/patient-profile.component';
import { PrescriptionEditCreateComponent } from './pages/prescription/prescription-list/prescription-edit-create/prescription-edit-create.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
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
            path: 'profile',
            component: PatientProfileComponent,
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
  { path: '**', component: Page404Component },
];
