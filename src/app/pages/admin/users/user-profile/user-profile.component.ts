import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {ActivatedRoute} from "@angular/router";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {UserDetails} from "@core/models/UserDetails";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {CatalogsService} from "@core/http/catalogs.service";
import {CreateEditService} from "@core/http/create-edit-service";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormatMobilePipe,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  param: string | null = null;
  paramGid: string | null = null;
  userImg: string | null = null;
  userRole: string | undefined;
  grupoEmpresarial: string | undefined;
  user: UserDetails;
  blankObject = {} as UserDetails;
  businessGroups: BusinessGroup[] = [];

  constructor(
    private ecService: CreateEditService,
    private catalogsService: CatalogsService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
      this.paramGid = params.get('gid');
    });
    this.userImg = 'assets/images/user/imgUSer.png';
    this.user = new UserDetails(this.blankObject);
    this.userRole = '';
  }

  getUserdetails(param: string, paramGid: string | null) {
    this.ecService.getUserById(paramGid).subscribe({
      next: (res: DefaultResponse<UserDetails[]>) => {
        const filtered = res.data.filter(value => value.idUsuario == param);
        filtered[0].email = this.removeAccents(filtered[0].email);
        this.user = filtered[0];
      },
    });
  }

  getBusinessGroups(): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];

        this.grupoEmpresarial = this.businessGroups.find(value => value.idGEMP === this.paramGid)?.nombre;

      },
    });
  }

  ngOnInit(): void {
    this.getUserdetails(this.param!, this.paramGid);
    this.getBusinessGroups();
  }


  removeAccents(value: string): string {
    return value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : value;
  }
}
