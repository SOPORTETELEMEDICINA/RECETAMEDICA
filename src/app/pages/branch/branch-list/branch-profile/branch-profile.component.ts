import {Component, OnInit} from '@angular/core';
import {CreateEditService} from "@core/http/create-edit-service";
import {ActivatedRoute} from "@angular/router";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {Branch} from "@core/models/Branch";
import {GEMP} from "@core/models/GEMP";
import {DoctorByBranchComponent} from "../../../doctor/doctor-list/doctor-by-branch/doctor-by-branch.component";
import {PatientByBranchComponent} from "../../../patient/patient-list/patient-by-branch/patient-by-branch.component";
import {UserByBranchComponent} from "../../../admin/users/user-by-branch/user-by-branch.component";

@Component({
  selector: 'app-branch-profile',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormatMobilePipe,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    DoctorByBranchComponent,
    PatientByBranchComponent,
    UserByBranchComponent,
  ],
  templateUrl: './branch-profile.component.html',
  styleUrl: './branch-profile.component.scss'
})
export class BranchProfileComponent implements OnInit {
  param: string | null = null;
  gid: string | null = null;
  userImg: string | null = null;
  branch: Branch;
  gemp: GEMP;
  blankObject = {} as Branch;
  blankObjectGEMP = {} as GEMP;

  constructor(
    private ecService: CreateEditService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
      this.gid = params.get('gid');
    });
    this.userImg = 'assets/images/user/imgUSer.png';
    this.branch = new Branch(this.blankObject);
    this.gemp = new GEMP(this.blankObjectGEMP);
  }

  getBranchDetails(param: string) {
    this.ecService.getBranchByIdBranch(param).subscribe({
      next: (res: DefaultResponse<Branch>) => {
        this.branch = res.data;
      },
    });
  }

  getGEMP() {
    this.ecService.getGempbyIdGemp(this.gid).subscribe({
      next: (res: DefaultResponse<GEMP>) => {
        this.gemp = res.data;
      },
    });
  }

  ngOnInit(): void {
    this.getGEMP();
    this.getBranchDetails(this.param!);
  }

}
