import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {MedicByIdUser} from "@core/models/MedicByIdUser";
import {PatientByIdMedic} from "@core/models/PatientByIdMedic";
import {CreateEditService} from "@core/http/create-edit-service";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {PatientByDoctorComponent} from "../../../patient/patient-list/patient-by-doctor/patient-by-doctor.component";

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormatMobilePipe,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    PatientByDoctorComponent
  ],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.scss'
})
export class DoctorProfileComponent implements OnInit {
  param: string | null = null;
  userImg: string | null = null;
  userRole: string | undefined;
  doctor: MedicByIdUser;
  patients: PatientByIdMedic[];
  blankObject = {} as MedicByIdUser;

  constructor(
    private ecService: CreateEditService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
    });
    this.userImg = 'assets/images/user/imgUSer.png';
    this.doctor = new MedicByIdUser(this.blankObject);
    this.patients = [];
    this.userRole = 'Medico';
  }

  getDoctorDetails(param: string) {
    this.ecService.getDoctorByIdDoctor(param).subscribe({
      next: (res: DefaultResponse<MedicByIdUser>) => {
        this.doctor = res.data;
      },
    });
  }

  ngOnInit(): void {
    this.getDoctorDetails(this.param!);
  }

}
