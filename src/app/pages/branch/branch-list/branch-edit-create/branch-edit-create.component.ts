import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserDetails } from '@core/models/UserDetails';
import { Settlement } from '@core/models/Settlement';
import { CatalogsService } from '@core/http/catalogs.service';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { UserType } from '@core/models/UserType';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { BusinessGroup } from '@core/models/BusinessGroup';
import { Branch } from '@core/models/Branch';
import { AuthManagementService } from '@core/service/auth-management.service';
import { UserRole } from '@core/models/Enums/UserRole';
import { AdminService } from '@core/http/admin.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-edit-create',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgIf,
    NgFor,
    MatDividerModule,
  ],
  templateUrl: './branch-edit-create.component.html',
  styleUrl: './branch-edit-create.component.scss',
})
export class BranchEditCreateComponent implements OnInit {
  user: UserDetails;
  settlements: Settlement[];
  settlementSearch: string;
  userTypes: UserType[];
  businessGroups: BusinessGroup[];
  branches: Branch[];
  isUserAdmin: boolean;

  keyPress$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private catalogsService: CatalogsService,
    private authManagement: AuthManagementService,
    private adminService: AdminService
  ) {
    this.user = new UserDetails();
    this.settlements = [];
    this.settlementSearch = '';
    this.userTypes = [];
    this.businessGroups = [];
    this.branches = [];
    this.isUserAdmin = false;
  }

  ngOnInit(): void {
    this.isUserAdmin = this.authManagement.isUserAdmin();

    console.log(this.isUserAdmin);

    this.getUserTypes();
    this.getBusinessGroups();

    this.keyPress$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchSettlements();
        })
      )
      .subscribe();
  }

  searchSettlementsByKeyPress(eveny: any) {
    this.keyPress$.next(event);
  }

  searchSettlements() {
    this.catalogsService
      .getSettlementByPostalCode(this.settlementSearch)
      .subscribe({
        next: (res: DefaultResponse<Settlement[]>) => {
          this.settlements = [...res.data];
        },
      });
  }

  setSelectedSettlement(value: Settlement) {
    if (value) {
      this.user.idAsentamiento = value.idAsentamiento;
    } else {
    }

    this.user.idAsentamiento = value ? value.idAsentamiento : undefined;
  }

  getUserTypes() {
    this.catalogsService.getUserTypes().subscribe({
      next: (res: DefaultResponse<UserType[]>) => {
        if (!this.isUserAdmin) {
          const index = res.data.findIndex(
            (r) => r.idTipoUsuario == UserRole.Admin
          );

          res.data.splice(index, 1);
        }

        this.userTypes = [...res.data];
      },
    });
  }

  getBusinessGroups() {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
      },
    });
  }

  getBranchesByGemp() {
    this.catalogsService.getBranchesByIdGEMP(this.user.idGEMP).subscribe({
      next: (res: Branch[]) => {
        this.branches = [...res];
      },
    });
  }

  createUpdateUser() {
    console.log(this.user);
    return;

    this.adminService.createUpdateUser(this.user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          html: 'Usuario creado correctamente',
        });
      },
    });
  }

  displayFn(settlement: Settlement): string {
    return settlement && settlement.nombreAsentamiento
      ? settlement.nombreAsentamiento
      : '';
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
