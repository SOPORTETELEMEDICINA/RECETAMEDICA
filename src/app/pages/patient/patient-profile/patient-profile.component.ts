import { Component } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss',
})
export class PatientProfileComponent {}
