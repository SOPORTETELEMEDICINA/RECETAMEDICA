import {Component, Input, OnInit} from '@angular/core';
import {MedicByIdUser} from "@core/models/MedicByIdUser";
import {PatientByIdMedic} from "@core/models/PatientByIdMedic";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {ProfileDataService} from "../tools/ProfileData.service";
import {Settlement} from "@core/models/Settlement";
import Swal from "sweetalert2";
import {debounceTime, distinctUntilChanged, Subject, tap} from "rxjs";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {UserDetails} from "@core/models/UserDetails";
import {CatalogsService} from "@core/http/catalogs.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {Branch} from "@core/models/Branch";
import {UserRole} from "@core/models/Enums/UserRole";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-profile-doctor',
  standalone: true,
  imports: [
    FormatMobilePipe,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatButton,
    MatDivider,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './profile-doctor.component.html',
  styleUrl: './profile-doctor.component.scss'
})
export class ProfileDoctorComponent implements OnInit {
  @Input() idUsuario: string | undefined;
  param: string | null = null;
  userImg: string | null = null;
  userRole: string | undefined;
  doctor: MedicByIdUser;
  patients: PatientByIdMedic[];
  blankObject = {} as MedicByIdUser;
  grupoEmpresarial: string | undefined;
  user: UserDetails;
  blankObjectUser = {} as UserDetails;
  businessGroups: BusinessGroup[] = [];
  branches: Branch[] = [];
  settlements: Settlement[];
  settlementSearch: string;
  userForm: UntypedFormGroup;
  roles: any[];
  keyPress$ = new Subject();
  cambiarContrasena = false;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  protected readonly UserRole = UserRole;

  constructor(
    public profileDataService: ProfileDataService,
    private catalogsService: CatalogsService,
    private fb: UntypedFormBuilder,
    private gfs: GeneralFunctionsService,
  ) {
    this.userImg = 'assets/images/user/imgUSer.png';
    this.doctor = new MedicByIdUser(this.blankObject);
    this.patients = [];
    this.userRole = 'Medico';
    this.userImg = 'assets/images/user/imgUSer.png';
    this.user = new UserDetails(this.blankObjectUser);
    this.settlements = [];
    this.settlementSearch = '';
    this.userForm = this.createUserForm();
    this.roles = Object.entries(UserRole)
      .filter(([name]) => name !== 'All')
      .filter(([name]) => name !== 'Medico')
      .filter(([name]) => name !== 'Paciente')
      .map(([name, value]) => ({
        name: this.formatRoleName(name),
        value,
      }));
  }

  getDoctorDetails(idUsuario: string) {
    this.profileDataService.getDoctorByIdUser(idUsuario).subscribe({
      next: (res: DefaultResponse<MedicByIdUser>) => {
        this.doctor = res.data;
      },
    });
  }

  ngOnInit(): void {
    this.getDoctorDetails(this.idUsuario!);
    this.getBusinessGroups();
    this.getUserdetails();
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

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : this.formControl.hasError('email')
        ? 'Correo invalido'
        : 'Error'
  }

  formatRoleName(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      idTipoUsuario: [this.user.idTipoUsuario],
      nombres: [this.user.nombres],
      primerApellido: [this.user.primerApellido],
      status: [this.user.status || 'Activo'],
      usr: [this.user.usr],
      idUsuario: [this.user.idUsuario],
      idGEMP: [this.user.idGEMP],
      idSucursal: [this.user.idSucursal],
      segundoApellido: [this.user.segundoApellido],
      idAsentamiento: [this.user.idAsentamiento],
      domicilio: [this.user.domicilio],
      movil: [this.user.movil],
      email: [this.user.email],
      password: [''],
      settlementSearch: [this.settlementSearch],
    });
  }

  getBusinessGroups(): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
        this.grupoEmpresarial = this.businessGroups.find(value => value.idGEMP === this.user.idGEMP)?.nombre;
      },
    });
  }

  getUserdetails() {
    const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));

    this.settlementSearch = userDetails.nombreAsentamiento;
    userDetails.email = this.removeAccents(userDetails.email);
    this.searchSettlements();
    this.getBranchesByGemp(userDetails.idGEMP);
    this.user = userDetails
    this.userForm = this.createUserForm();
  }

  toggleCambiarContrasena(): void {
    this.cambiarContrasena = !this.cambiarContrasena;

    if (!this.cambiarContrasena) {
      this.userForm.patchValue({password: ''});
    }
  }

  getBranchesByGemp(idGEMP = '') {
    if (!idGEMP) {
      idGEMP = this.userForm.get('idGEMP')?.value
    }
    this.catalogsService.getBranchesByIdGEMP(idGEMP).subscribe({
      next: (res: DefaultResponse<Branch[]>) => {
        this.branches = [...res.data];
      },
    });
  }

  removeAccents(value: string): string {
    return value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : value;
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

          const selectedSettlement = this.settlements.find(
            (settlement) => settlement.asentamiento === this.settlementSearch
          );
          if (selectedSettlement) {
            this.userForm.patchValue({settlementSearch: selectedSettlement});
            this.user.idAsentamiento = selectedSettlement.idAsentamiento;
          }
        },
      });

  }

  public confirmAdd(): void {
    const userData = this.userForm.getRawValue();
    delete userData.settlementSearch;
    if (!this.cambiarContrasena) {
      delete userData.password;
    }

    this.profileDataService.updateUser(userData).subscribe({
      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Correcto!',
          html: 'Usuario actualizado con éxito. <br> ' +
            'Favor de cerrar sesión y volver a entrar para aplicar los cambios.'
        }).then(
          () => window.location.reload()
        );

      },
      error: (err) => {
        this.gfs.showErrorAlert('Hubo un error al Crear/editar el Usuario', err);
      },
    });
  }
}
