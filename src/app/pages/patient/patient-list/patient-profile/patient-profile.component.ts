import {Component, OnInit} from '@angular/core';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {PatientDetails} from "@core/models/PatientDetails";
import {ActivatedRoute} from "@angular/router";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {UserRole} from "@core/models/Enums/UserRole";
import {MatList, MatListItem} from "@angular/material/list";
import {NgForOf} from "@angular/common";
import {CreateEditService} from "@core/http/create-edit-service";

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    ReactiveFormsModule,
    FormatMobilePipe,
    MatList,
    MatListItem,
    NgForOf
  ],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.scss'
})
export class PatientProfileComponent implements OnInit {
  param: string | null = null;
  userImg: string | null = null;
  userRole: string | undefined;
  patient: PatientDetails;
  blankObject = {} as PatientDetails;

  constructor(
    private ceService: CreateEditService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
    });
    this.userImg = 'assets/images/user/imgUSer.png';
    this.patient = new PatientDetails(this.blankObject);
    this.userRole = '';
  }

  getPatientDetails(param: string) {
    this.ceService.getpatientByIdUser(param).subscribe({
      next: (res: DefaultResponse<PatientDetails>) => {
        this.patient = res.data;
        this.userRole = this.getRoleName(res.data.idTipoUsuario);
      },
    });
  }

  ngOnInit(): void {
    this.getPatientDetails(this.param!);
  }

  getRoleName(roleValue: string): string | undefined {
    const roleEntry = Object.entries(UserRole).find(([, value]) => value === roleValue);
    return roleEntry ? roleEntry[0] : '';
  }
}
