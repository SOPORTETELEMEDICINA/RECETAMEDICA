import { MatToolbarModule } from '@angular/material/toolbar';
import {
  CommonModule,
  DOCUMENT,
  NgClass,
  NgOptimizedImage,
} from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { InConfiguration, LanguageService, RightSidebarService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthManagementService } from '@core/service/auth-management.service';
import { PatientDetails } from '@core/models/PatientDetails';
import { BusinessGroup } from '@core/models/BusinessGroup';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { CatalogsService } from '@core/http/catalogs.service';
import { BusinessGroupService } from '@core/service/business-group.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatButtonModule,
    MatMenuModule,
    NgScrollbar,
    FeatherIconsComponent,
    MatIconModule,
    MatToolbarModule,
    NgOptimizedImage,
    CommonModule,
  ],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public config!: InConfiguration;
  userName?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;
  businessGroups: BusinessGroup[] = [];
  businessGroupId: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private router: Router,
    public languageService: LanguageService,
    private authManagement: AuthManagementService,
    private catalogsService: CatalogsService,
    private businessGroupService: BusinessGroupService
  ) {
    super();
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.svg', lang: 'de' },
  ];

  data: PatientDetails[] = [];

  ngOnInit() {
    this.config = this.configService.configData;

    this.docElement = document.documentElement;

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.svg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    const userData = this.authManagement.userData();

    if ((this.businessGroupId = '')) {
      this.changeBusinessGroupId(userData.GEMP);
    } else {
      const storedBusinessGroupId = localStorage.getItem('businessGroupId');
      if (storedBusinessGroupId) {
        this.businessGroupId = storedBusinessGroupId;
      }
    }
    this.userName = userData.unique_name;

    this.getBusinessGroups();
  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  getBusinessGroups(): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
        this.businessGroups.sort((a, b) => {
          if (a.logoBase64 === null && b.logoBase64 !== null) {
            return 1;
          } else if (a.logoBase64 !== null && b.logoBase64 === null) {
            return -1;
          }
          return a.nombre.localeCompare(b.nombre);
        });

        if (this.businessGroupId == '') {
          this.businessGroupId = this.businessGroups[0].idGEMP;
        }
      },
    });
  }

  changeBusinessGroupId(id: string): void {
    this.businessGroupService.setBusinessGroupId(id);
    const storedBusinessGroupId = localStorage.getItem('businessGroupId');
    if (storedBusinessGroupId) {
      this.businessGroupId = storedBusinessGroupId;
    }
  }
}
