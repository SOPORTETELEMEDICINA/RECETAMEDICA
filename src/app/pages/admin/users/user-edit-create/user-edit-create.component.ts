import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialog,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
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
import { Doctor } from '@core/models/Doctor';
import { CreateUserResponse } from '@core/models/Http/Response/CreateUserResponse';
import { Patient } from '@core/models/Patient';
import { FederalEntity } from '@core/models/FederalEntity';

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
  templateUrl: './user-edit-create.component.html',
  styleUrl: './user-edit-create.component.scss',
})
export class UserEditCreateComponent implements OnInit {
  UserRole = UserRole;

  user: UserDetails;
  doctor: Doctor;
  patient: Patient;
  settlements: Settlement[];
  settlementSearch: string;
  userTypes: UserType[];
  federalEntity: FederalEntity[];
  businessGroups: BusinessGroup[];
  branches: Branch[];
  cities: Branch[];
  idUsuarioAuth!: string;

  isUserAdmin: boolean;
  isUserPharmacySupervision: boolean;
  isUserPharmacyResponsible: boolean;

  keyPress$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private catalogsService: CatalogsService,
    private authManagement: AuthManagementService,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<UserEditCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private userFromTable: UserDetails
  ) {
    this.user = new UserDetails();
    this.doctor = new Doctor();
    this.patient = new Patient();
    this.settlements = [];
    this.settlementSearch = '';
    this.userTypes = [];
    this.federalEntity = [];
    this.businessGroups = [];
    this.branches = [];
    this.cities = [];
    this.isUserAdmin = false;
    this.isUserPharmacySupervision = false;
    this.isUserPharmacyResponsible = false;
  }

  ngOnInit(): void {
    if (this.userFromTable) {
      this.user = this.userFromTable;

      this.settlementSearch = this.user.nombreAsentamiento;

      this.searchSettlements();
      this.getBranchesByGemp();
    }

    this.isUserAdmin = this.authManagement.isUserAdmin();
    const userData = this.authManagement.userData();
    this.idUsuarioAuth = userData.IdUsuario;

    this.getUserTypes();
    this.getFederalEntity();
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

  searchSettlementsByKeyPress() {
    this.keyPress$.next(event);
  }

  searchSettlements() {
    if (!this.settlementSearch) {
      this.settlements = [];

      return;
    }

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
        this.userTypes = [...res.data];

        if (!this.isUserAdmin) {
          const index = this.userTypes.findIndex(
            (r) => r.idTipoUsuario == UserRole.Admin
          );

          this.userTypes.splice(index, 1);
        }

        if (!this.isUserPharmacyResponsible && !this.isUserAdmin) {
          const filteredUserTypes = this.userTypes.filter((t) =>
            [
              UserRole.Empleado_Farmacia,
              UserRole.Responsable_Farmacia,
              UserRole.Medico,
            ].some((r) => r == t.idTipoUsuario)
          );
          this.userTypes = [...filteredUserTypes];
        }
      },
    });
  }

  getFederalEntity() {
    this.catalogsService.getFederalEntitys().subscribe({
      next: (res: DefaultResponse<FederalEntity[]>) => {
        this.federalEntity = [...res.data];
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
    let canContinue = true;

    if (!this.user.idAsentamiento) {
      Swal.fire({
        icon: 'error',
        html: 'Busca y selecciona un asentamiento para continuar',
      });

      return;
    }

    if (this.user.idTipoUsuario == UserRole.Medico) {
      if (
        !this.doctor.cedulaEspecialidad ||
        !this.doctor.cedulaGeneral ||
        !this.doctor.especialidad ||
        !this.doctor.horario ||
        !this.doctor.universidad
      ) {
        Swal.fire({
          icon: 'error',
          html: 'Falta la información sobre el médico',
        });

        canContinue = false;
      }
    }

    if (this.user.idTipoUsuario == UserRole.Paciente) {
      if (
        !this.patient.fechaNacimiento ||
        !this.patient.genero ||
        !this.patient.idEntidadNacimiento
      ) {
        Swal.fire({
          icon: 'error',
          html: 'Falta la información sobre el paciente',
        });

        canContinue = false;
      }
    }

    if (!canContinue) return;

    this.adminService.createUpdateUser(this.user).subscribe({
      next: (res: DefaultResponse<CreateUserResponse>) => {
        if (this.user.idTipoUsuario == UserRole.Medico) {
          this.doctor.idUsuario = res.data.idUsuario;

          this.adminService.createUpdateDoctor(this.doctor).subscribe({
            next: (resDoc: DefaultResponse<string>) => {
              Swal.fire({
                icon: 'success',
                html: resDoc.message,
              });

              this.dialogRef.close(true);
            },
          });
        } else if (this.user.idTipoUsuario == UserRole.Paciente) {
          this.patient.idUsuario = res.data.idUsuario;
          this.patient.idMedico = this.idUsuarioAuth;

          this.adminService.createUpdatePatient(this.patient).subscribe({
            next: (resPat: DefaultResponse<string>) => {
              Swal.fire({
                icon: 'success',
                html: resPat.message,
              });

              this.dialogRef.close(true);
            },
          });
        } else {
          Swal.fire({
            icon: 'success',
            html: res.message,
          });

          this.dialogRef.close(true);
        }
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
