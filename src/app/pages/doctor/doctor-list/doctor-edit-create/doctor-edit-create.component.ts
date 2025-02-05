// noinspection DuplicatedCode

import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {UserRole} from "@core/models/Enums/UserRole";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatDivider} from "@angular/material/divider";
import {MatSelect} from "@angular/material/select";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserDetails} from "@core/models/UserDetails";
import {Doctor} from "@core/models/Doctor";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {Branch} from "@core/models/Branch";
import {CatalogsService} from "@core/http/catalogs.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DoctorDetails} from "@core/models/DoctorDetails";
import {Settlement} from "@core/models/Settlement";
import {debounceTime, distinctUntilChanged, Subject, switchMap, tap} from "rxjs";
import {CreateUserResponse} from "@core/models/Http/Response/CreateUserResponse";
import {AdminService} from "@core/http/admin.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {ImageSignature} from "@core/models/ImageSignature";
import {CreateEditService} from "@core/http/create-edit-service";
import {UppercaseNoAccentDirective} from "@shared/directives/uppercase-no-accent.directive";

@Component({
  selector: 'app-doctor-edit-create',
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
    FileUploadComponent,
    ReactiveFormsModule,
    NgClass,
    MatAutocompleteTrigger,
    MatAutocomplete,
    NgIf,
    UppercaseNoAccentDirective
  ],
  templateUrl: './doctor-edit-create.component.html',
  styleUrl: './doctor-edit-create.component.scss'
})
export class DoctorEditCreateComponent implements OnInit {
  param: string | null = null;

  UserRole = UserRole;
  user: UserDetails;
  doctor: Doctor;
  archive: ImageSignature;
  userImg?: string;

  businessGroups: BusinessGroup[];
  branches: Branch[];

  settlements: Settlement[];
  settlementSearch: string;

  keyPress$ = new Subject();

  userForm: UntypedFormGroup;
  doctorForm: UntypedFormGroup;
  archiveForm: UntypedFormGroup;
  blankObject = {} as UserDetails;
  blankObjectDoctor = {} as Doctor;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  constructor(
    private catalogsService: CatalogsService,
    private adminService: AdminService,
    private gfs: GeneralFunctionsService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ceService: CreateEditService,
  ) {
    this.user = new UserDetails(this.blankObject);
    this.doctor = new Doctor(this.blankObjectDoctor);
    this.archive = new ImageSignature();
    this.businessGroups = [];
    this.branches = [];
    this.settlements = [];
    this.settlementSearch = '';

    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
    });

    this.userForm = this.createUserForm();
    this.doctorForm = this.createDoctorForm();
    this.archiveForm = this.createArchivesForm();
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
      this.getDoctorDetails(this.param);
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

  getDoctorDetails(param: string) {
    this.ceService.getDoctorByIdUser(param).subscribe({
      next: (res: DefaultResponse<DoctorDetails>) => {
        this.settlementSearch = res.data.asentamiento;

        this.searchSettlements();

        this.user = this.mapToUserDetails(res.data);
        this.doctor = this.mapToDoctor(res.data);

        this.userForm = this.createUserForm();
        this.doctorForm = this.createDoctorForm();
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
      idTipoUsuario: [this.UserRole.Medico],
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

  createDoctorForm(): UntypedFormGroup {
    return this.fb.group({
      idUsuario: [this.doctor.idUsuario],
      cedulaGeneral: [this.doctor.cedulaGeneral],
      universidad: [this.doctor.universidad],
      especialidad: [this.doctor.especialidad],
      cedulaEspecialidad: [this.doctor.cedulaEspecialidad ?? ''],
      horario: [this.doctor.horario],
      idMedico: [this.doctor.idMedico],
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
    return userDetails;
  }

  mapToDoctor(response: any): Doctor {
    const doctor = new Doctor(this.blankObjectDoctor);
    doctor.idMedico = response.idMedico;
    doctor.idUsuario = response.idUsuario;
    doctor.cedulaGeneral = response.cedulaGeneral;
    doctor.universidad = response.universidad;
    doctor.especialidad = response.especialidad;
    doctor.cedulaEspecialidad = response.cedulaEspecialidad;
    doctor.horario = response.horario;
    return doctor;
  }

  public confirmAdd(): void {
    const userData = this.userForm.getRawValue();
    delete userData.settlementSearch;

    this.adminService.createUpdateUser(userData).pipe(
      tap((res: DefaultResponse<CreateUserResponse>) => {
        if (!this.param) {
          this.doctorForm.patchValue({'idUsuario': res.data.idUsuario});
          this.archiveForm.patchValue({'idUsuario': res.data.idUsuario});
        }
      }),
      switchMap(() => this.adminService.createUpdateDoctor(this.doctorForm.getRawValue()))
    ).subscribe({
      next: () => {
        this.gfs.showAlert(this.param ? 'Doctor actualizado con éxito' : 'Doctor creado con éxito.', 'Correcto!');
        this.router.navigate(['doctor/doctor-list']).then();
      },
      error: (err) => {
        this.gfs.showErrorAlert('Hubo un error en el proceso', err);
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
