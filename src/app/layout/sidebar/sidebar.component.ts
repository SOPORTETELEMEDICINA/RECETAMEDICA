/* eslint-disable @typescript-eslint/no-unused-vars */
import {NavigationEnd, Router, RouterLink, RouterLinkActive,} from '@angular/router';
import {DOCUMENT, NgClass} from '@angular/common';
import {Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2,} from '@angular/core';
import {ROUTES} from './sidebar-items';
import {RouteInfo} from './sidebar.metadata';
import {TranslateModule} from '@ngx-translate/core';
import {NgScrollbar} from 'ngx-scrollbar';
import {UnsubscribeOnDestroyAdapter} from '@shared';
import {AuthManagementService} from '@core/service/auth-management.service';
import {UserRole} from '@core/models/Enums/UserRole';
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {CatalogsService} from "@core/http/catalogs.service";
import {BusinessGroupService} from "@core/service/business-group.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    RouterLinkActive,
    RouterLink,
    NgClass,
    TranslateModule,
  ],
})
export class SidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg: string;
  userType?: string;
  empresa?: string;
  headerHeight = 60;
  currentRoute?: string;
  businessGroups: BusinessGroup[] = [];
  businessGroupId: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authManagement: AuthManagementService,
    private catalogsService: CatalogsService,
    private businessGroupService: BusinessGroupService,
    private router: Router
  ) {
    super();
    this.elementRef.nativeElement.closest('body');
    this.subs.sink = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
    this.userImg = 'assets/images/user/placeholder.png';
  }

  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize();
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }

  ngOnInit() {

    this.businessGroupService.businessGroupId$.subscribe((id) => {
      this.businessGroupId = id!;
      this.getBusinessGroups(id!);

    });

    const userData = this.authManagement.userData();

    this.userFullName = userData.unique_name;
    this.userType = userData.role;

    this.sidebarItems = ROUTES.filter(
      (x) =>
        userData.IdRol == UserRole.Admin ||
        x.role.includes(userData.IdRol) ||
        x.role.includes(UserRole.All)
    );

    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize();
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }

  checkStatuForResize() {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }

  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  logout() {
    this.authManagement.logout();

    this.router.navigate(['/authentication/signin']);
  }

  getBusinessGroups(id: string): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];

        const img = this.businessGroups.find(item => item.idGEMP === id)?.logoBase64;
        this.empresa = this.businessGroups.find(item => item.idGEMP === id)?.nombre;
        this.userImg = img ? 'data:image/png;base64,' + img : 'assets/images/user/placeholder.png';
      },
    });
  }
}
