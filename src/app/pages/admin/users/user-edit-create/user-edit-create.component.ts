// noinspection DuplicatedCode

import {Component, OnInit} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {UserDetails} from '@core/models/UserDetails';
import {Settlement} from '@core/models/Settlement';
import {CatalogsService} from '@core/http/catalogs.service';
import {debounceTime, distinctUntilChanged, Subject, tap} from 'rxjs';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatDivider} from '@angular/material/divider';
import {BusinessGroup} from '@core/models/BusinessGroup';
import {Branch} from '@core/models/Branch';
import {UserRole} from '@core/models/Enums/UserRole';
import {AdminService} from '@core/http/admin.service';
import {DefaultResponse} from '@core/models/Http/DefaultResponse';
import {CreateUserResponse} from '@core/models/Http/Response/CreateUserResponse';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatOptionModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {ImageSignature} from "@core/models/ImageSignature";
import {CreateEditService} from "@core/http/create-edit-service";
import {UppercaseNoAccentDirective} from "@shared/directives/uppercase-no-accent.directive";

@Component({
  selector: 'app-user-edit-create',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatDivider,
    MatError,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    NgClass,
    MatAutocompleteTrigger,
    MatAutocomplete,
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatButtonModule,
    FileUploadComponent,
    UppercaseNoAccentDirective
  ],
  templateUrl: './user-edit-create.component.html',
  styleUrl: './user-edit-create.component.scss',
})
export class UserEditCreateComponent implements OnInit {
  param: string | null = null;
  paramGid: string | null = null;
  roles: any[];

  user: UserDetails;
  archive: ImageSignature;
  userImg?: string;

  businessGroups: BusinessGroup[];
  branches: Branch[];

  settlements: Settlement[];
  settlementSearch: string;

  keyPress$ = new Subject();

  userForm: UntypedFormGroup;
  archiveForm: UntypedFormGroup;
  blankObject = {} as UserDetails;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  constructor(
    private catalogsService: CatalogsService,
    private adminService: AdminService,
    private gfs: GeneralFunctionsService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ecService: CreateEditService,
  ) {
    this.user = new UserDetails(this.blankObject);
    this.archive = new ImageSignature();
    this.businessGroups = [];
    this.branches = [];
    this.settlements = [];
    this.settlementSearch = '';

    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
      this.paramGid = params.get('gid');
    });

    this.userForm = this.createUserForm();
    this.archiveForm = this.createArchivesForm();

    const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));
    if (userDetails?.idTipoUsuario === UserRole.Responsable_Farmacia) {
      this.roles = Object.entries(UserRole)
        .filter(([name]) => name === 'Empleado_Farmacia')
        .map(([name, value]) => ({
          name: this.formatRoleName(name),
          value,
        }));
    } else {
      this.roles = Object.entries(UserRole)
        .filter(([name]) => !['All', 'Medico', 'Paciente'].includes(name))
        .map(([name, value]) => ({
          name: this.formatRoleName(name),
          value,
        }));
    }
  }

  formatRoleName(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : this.formControl.hasError('email')
        ? 'Correo invalido'
        : 'Error'
  }

  ngOnInit(): void {
    this.userImg = 'assets/images/user/imgUSer.png';
    this.getBusinessGroups();
    if (this.param) {
      this.getUserdetails(this.param, this.paramGid);
    }

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

  getBusinessGroups() {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
      },
    });
  }

  removeAccents(value: string): string {
    return value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : value;
  }

  getUserdetails(param: string, paramGid: string | null) {
    this.ecService.getUserById(paramGid).subscribe({
      next: (res: DefaultResponse<UserDetails[]>) => {
        const filtered = res.data.filter(value => value.idUsuario == param);
        this.settlementSearch = filtered[0].nombreAsentamiento;
        filtered[0].email = this.removeAccents(filtered[0].email);
        this.searchSettlements();
        this.user = this.mapToUserDetails(filtered[0]);
        this.userForm = this.createUserForm();
      },
    });
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


  createUserForm(): UntypedFormGroup {
    return this.fb.group({
      idUsuario: [this.user.idUsuario],
      usr: [this.user.usr],
      password: [this.user.password],
      idTipoUsuario: [this.user.idTipoUsuario],
      idGEMP: [this.user.idGEMP],
      idSucursal: [this.user.idSucursal],
      nombres: [this.user.nombres],
      primerApellido: [this.user.primerApellido],
      segundoApellido: [this.user.segundoApellido],
      idAsentamiento: [this.user.idAsentamiento],
      domicilio: [this.user.domicilio],
      movil: [this.user.movil],
      email: [this.user.email],
      settlementSearch: [this.settlementSearch],
    });
  }

  createArchivesForm(): UntypedFormGroup {
    return this.fb.group({
      idUsuario: [this.archive.idUsuario],
      imagen: [this.archive.imagen],
      firma: [this.archive.firma],
      pdf: [this.archive.pdf],
    });
  }

  mapToUserDetails(response: any): UserDetails {
    this.getBranchesByGemp(response.idGEMP);
    const userDetails = new UserDetails(this.blankObject);
    userDetails.idUsuario = response.idUsuario;
    userDetails.nombres = response.nombres;
    userDetails.primerApellido = response.primerApellido;
    userDetails.segundoApellido = response.segundoApellido;
    userDetails.movil = response.movil;
    userDetails.email = response.email;
    userDetails.domicilio = response.domicilio;
    userDetails.idAsentamiento = response.idAsentamiento;
    userDetails.nombreAsentamiento = response.asentamiento;
    userDetails.idCP = response.idCP;
    userDetails.codigoPostal = response.codigoPostal;
    userDetails.idMunicipio = response.idMunicipio;
    userDetails.municipio = response.municipio;
    userDetails.idGEMP = response.idGEMP;
    userDetails.usr = response.usr;
    userDetails.idSucursal = response.idSucursal;
    userDetails.idTipoUsuario = response.idTipoUsuario;
    return userDetails;
  }

  public confirmAdd(): void {
    const userData = this.userForm.getRawValue();
    delete userData.settlementSearch;
    this.adminService.createUpdateUser(userData).subscribe({
      next: (res: DefaultResponse<CreateUserResponse>) => {
        if (!this.param) {
          this.archiveForm.patchValue({'idUsuario': res.data.idUsuario});
        }
        // this.adminService.uploadImages(this.archiveForm.getRawValue()).subscribe({
        //   next: (res: DefaultResponse<string>) => {
        //     Swal.fire({
        //       icon: 'success',
        //       html: res.message,
        //     }).then();
        //   },
        //   error: (err) => {
        //     this.gfs.showErrorAlert('Hubo un error al Insertar las imagenes', err);
        //   },
        // });
        this.gfs.showAlert(this.param ? 'Paciente actualizado con éxito' : 'Paciente creado con éxito.', 'Correcto!');
        this.router.navigate(['admin/user-list']).then();
      },
      error: (err) => {
        this.gfs.showErrorAlert('Hubo un error al Crear/editar el Usuario', err);
      },
    });
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

}
