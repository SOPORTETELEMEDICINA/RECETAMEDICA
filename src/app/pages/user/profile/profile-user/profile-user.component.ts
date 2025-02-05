import {Component, Input, OnInit} from '@angular/core';
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {UserDetails} from "@core/models/UserDetails";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {CatalogsService} from "@core/http/catalogs.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {Settlement} from "@core/models/Settlement";
import {UserRole} from "@core/models/Enums/UserRole";
import {debounceTime, distinctUntilChanged, Subject, tap} from "rxjs";
import {Branch} from "@core/models/Branch";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatDivider} from "@angular/material/divider";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {NgClass, NgForOf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {ProfileDataService} from "../tools/ProfileData.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {AuthManagementService} from "@core/service/auth-management.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [
    FormatMobilePipe,
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatDivider,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    MatButton,
    NgClass
  ],
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent implements OnInit {

  @Input() idGemp!: string;
  userImg: string | null = null;
  isAdmin: boolean;
  grupoEmpresarial: string | undefined;
  user: UserDetails;
  blankObject = {} as UserDetails;
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
    private authManagement: AuthManagementService,
    private catalogsService: CatalogsService,
    private fb: UntypedFormBuilder,
    private gfs: GeneralFunctionsService,
    private profileDataService: ProfileDataService
  ) {
    this.userImg = 'assets/images/user/imgUSer.png';
    this.user = new UserDetails(this.blankObject);
    this.isAdmin = this.authManagement.isUserAdmin();
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

  getUserdetails() {
    const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));

    this.settlementSearch = userDetails.nombreAsentamiento;
    userDetails.email = this.removeAccents(userDetails.email);
    this.searchSettlements();
    this.getBranchesByGemp(userDetails.idGEMP);
    this.user = userDetails
    this.userForm = this.createUserForm();
  }

  getBusinessGroups(): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
        this.grupoEmpresarial = this.businessGroups.find(value => value.idGEMP === this.idGemp)?.nombre;
      },
    });
  }

  getBranchesByGemp(idGEMP = '') {
    if (!idGEMP) {
      idGEMP = this.userForm.get('idGEMP')?.value
    }
    if (this.isAdmin) {
      this.catalogsService.getBranchesByIdGEMP(idGEMP).subscribe({
        next: (res: DefaultResponse<Branch[]>) => {
          this.branches = [...res.data];
        },
      });
    }
  }

  ngOnInit(): void {
    this.getUserdetails();
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

  toggleCambiarContrasena(): void {
    this.cambiarContrasena = !this.cambiarContrasena;

    if (!this.cambiarContrasena) {
      this.userForm.patchValue({password: ''});
    }
  }

  removeAccents(value: string): string {
    return value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : value;
  }

  searchSettlements() {
    if (!this.settlementSearch) {
      this.settlements = [];
      return;
    }
    if (this.isAdmin) {
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
  }

  displayFn(settlement: Settlement): string {
    return settlement && settlement.asentamiento ? settlement.asentamiento : '';
  }

  searchSettlementsByKeyPress(event: Event): void {
    this.keyPress$.next(event);
  }

  setSelectedSettlement(value: Settlement): void {
    this.user.idAsentamiento = value ? value.idAsentamiento : undefined;
    this.userForm.patchValue({'idAsentamiento': this.user.idAsentamiento});
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
