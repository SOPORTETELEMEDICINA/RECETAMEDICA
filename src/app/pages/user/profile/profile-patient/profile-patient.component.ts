import {Component, Input, OnInit} from '@angular/core';
import {FormatMobilePipe} from "@core/pipes/format-mobile.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {NgClass} from "@angular/common";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {UserRole} from "@core/models/Enums/UserRole";
import {UserDetails} from "@core/models/UserDetails";
import {MatButton} from "@angular/material/button";
import {MatDivider} from "@angular/material/divider";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {BusinessGroup} from "@core/models/BusinessGroup";
import Swal from "sweetalert2";
import {CatalogsService} from "@core/http/catalogs.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {ProfileDataService} from "../tools/ProfileData.service";

@Component({
  selector: 'app-profile-patient',
  standalone: true,
  imports: [
    MatIcon,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    ReactiveFormsModule,
    FormatMobilePipe,
    MatButton,
    MatDivider,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgClass
  ],
  templateUrl: './profile-patient.component.html',
  styleUrl: './profile-patient.component.scss'
})
export class ProfilePatientComponent implements OnInit {
  @Input() idGemp!: string;
  userImg: string | null = null;
  grupoEmpresarial: string | undefined;
  user: UserDetails;
  blankObject = {} as UserDetails;
  businessGroups: BusinessGroup[] = [];
  userForm: UntypedFormGroup;
  cambiarContrasena = false;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  protected readonly UserRole = UserRole;

  constructor(
    private catalogsService: CatalogsService,
    private fb: UntypedFormBuilder,
    private gfs: GeneralFunctionsService,
    private profileDataService: ProfileDataService
  ) {
    this.userImg = 'assets/images/user/imgUSer.png';
    this.user = new UserDetails(this.blankObject);
    this.userForm = this.createUserForm();
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : this.formControl.hasError('email')
        ? 'Correo invalido'
        : 'Error'
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
    });
  }

  getUserdetails() {
    const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));

    userDetails.email = this.removeAccents(userDetails.email);
    this.user = userDetails
    this.userForm = this.createUserForm();
  }

  getBusinessGroups(): void {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
        this.grupoEmpresarial = this.businessGroups.find(value => value.idGEMP === this.user.idGEMP)?.nombre;
      },
    });
  }

  ngOnInit(): void {
    this.getUserdetails();
    this.getBusinessGroups();
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

  public confirmAdd(): void {
    const userData = this.userForm.getRawValue();
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
