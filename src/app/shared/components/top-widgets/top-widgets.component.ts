import {Component, Input, OnInit} from '@angular/core';
import {UserRole} from "@core/models/Enums/UserRole";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {Statistics} from "@core/models/Statistics";
import {AuthManagementService} from "@core/service/auth-management.service";
import {GeneralService} from "@core/http/general.service";
import {BusinessGroupService} from "@core/service/business-group.service";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {DashboardKpiResponse} from "@core/models/Http/Response/DashboardKpiResponse";

@Component({
  selector: 'app-top-widgets',
  standalone: true,
  imports: [],
  templateUrl: './top-widgets.component.html',
  styleUrl: './top-widgets.component.scss'
})
export class TopWidgetsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  @Input() control: number = 0;
  protected readonly UserRole = UserRole;
  statistics: Statistics = new Statistics({} as Statistics);
  businessGroupId: string | null = null;

  constructor(
    private authManagement: AuthManagementService,
    private generalService: GeneralService,
    private businessGroupService: BusinessGroupService,
    private router: Router,
    public httpClient: HttpClient,
    public dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    const userData = this.authManagement.userData();

    this.businessGroupService.businessGroupId$.subscribe((id) => {
      this.businessGroupId = id!;
    });
    this.statistics.userRole = userData.IdRol;

    this.getKpis();
    console.log(this.control)
  }

  onCreatePatient() {
    this.router.navigate(['patient/create-edit']).then();
  }

  onCreatePrescription() {
    this.router.navigate(['/prescription/create']).then();
  }

  getKpis() {
    this.generalService.getKpiDoctorBranchManager().subscribe({
      next: (res: DefaultResponse<DashboardKpiResponse[]>) => {
        if (res.data.length) {
          const [kpi] = res.data;

          this.statistics.prescriptions = kpi.countRecetas;

          if (this.statistics.userRole == UserRole.Medico) {
            this.statistics.patients = kpi.countPacientes;
          } else {
            this.statistics.employees = kpi.countPacientes;
          }
        }
      },
    });
  }


}
