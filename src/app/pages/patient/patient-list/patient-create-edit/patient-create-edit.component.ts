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
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {UserRole} from "@core/models/Enums/UserRole";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatDivider} from "@angular/material/divider";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserDetails} from "@core/models/UserDetails";
import {BusinessGroup} from "@core/models/BusinessGroup";
import {Branch} from "@core/models/Branch";
import {CatalogsService} from "@core/http/catalogs.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {ActivatedRoute, Router} from "@angular/router";
import {FederalEntity} from "@core/models/FederalEntity";
import {MatList, MatListItem} from "@angular/material/list";
import {Settlement} from "@core/models/Settlement";
import {debounceTime, distinctUntilChanged, Subject, tap} from "rxjs";
import {AdminService} from "@core/http/admin.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {PatientDetails} from "@core/models/PatientDetails";
import {Allergy} from "@core/models/Allergy";
import {Molecule} from "@core/models/Molescule";
import {Patology} from "@core/models/Patology";
import {CreateUserResponse} from "@core/models/Http/Response/CreateUserResponse";
import {PatientService} from "@core/http/patient.service";
import {HttpErrorResponse} from '@angular/common/http';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatOptionModule} from "@angular/material/core";
import {MatTooltip} from "@angular/material/tooltip";
import {CreateEditService} from "@core/http/create-edit-service";
import {AuthManagementService} from "@core/service/auth-management.service";
import {UppercaseNoAccentDirective} from "@shared/directives/uppercase-no-accent.directive";

@Component({
  selector: 'app-patient-create-edit',
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
    MatList,
    MatListItem,
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
    MatTooltip,
    UppercaseNoAccentDirective,
  ],
  templateUrl: './patient-create-edit.component.html',
  styleUrl: './patient-create-edit.component.scss'
})
export class PatientCreateEditComponent implements OnInit {
  param: string | null = null;

  UserRole = UserRole;
  user: UserDetails;
  patient: PatientDetails;
  userImg?: string;

  businessGroups: BusinessGroup[];
  branches: Branch[];
  federalEntity: FederalEntity[];
  allergies: Allergy[];
  molescules: Molecule[];
  patologies: Patology[];

  settlements: Settlement[];
  settlementSearch: string;
  searchAllergies: string;
  searchMolescule: string;
  searchPatologies: string;
  keyPress$ = new Subject();
  keyPressAllergy$ = new Subject();
  keyPressPatology$ = new Subject();
  keyPressMolecule$ = new Subject();

  patologiesNames: string[];
  molesculesNames: string[];
  allergiesNames: string[];

  isDoctor: boolean;
  userData: any;

  userForm: UntypedFormGroup;
  patientForm: UntypedFormGroup;

  blankObject = {} as PatientDetails;
  blankObjectUser = {} as UserDetails;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  constructor(
    private catalogsService: CatalogsService,
    private gfs: GeneralFunctionsService,
    private router: Router,
    private adminService: AdminService,
    private authManagement: AuthManagementService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private ceService: CreateEditService,
  ) {
    this.user = new UserDetails(this.blankObjectUser);
    this.patient = new PatientDetails(this.blankObject);
    this.businessGroups = [];
    this.branches = [];
    this.federalEntity = [];
    this.settlements = [];
    this.settlementSearch = '';
    this.searchAllergies = '';
    this.searchMolescule = '';
    this.searchPatologies = '';

    this.userData = this.authManagement.userData();
    this.isDoctor = this.authManagement.isUserDoctor();

    this.route.paramMap.subscribe(params => {
      this.param = params.get('param');
    });

    this.userForm = this.createUserForm();
    this.patientForm = this.createPatientForm();

    this.allergies = [];
    this.molescules = [];
    this.patologies = [];
    this.patologiesNames = [];
    this.molesculesNames = [];
    this.allergiesNames = [];
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
    this.getFederalEntity();
    console.log(this.userData);

    if (this.param) {
      this.getPatientDetails(this.param);
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

    this.keyPressAllergy$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchAllergiesByName();
        })
      )
      .subscribe();

    this.keyPressPatology$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchPatologiesByName();
        })
      )
      .subscribe();

    this.keyPressMolecule$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchMolesculesByName();
        })
      )
      .subscribe();


  }

  removeAccents(value: string): string {
    return value ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : value;
  }

  getBusinessGroups() {
    this.catalogsService.getBusinessGroups().subscribe({
      next: (res: DefaultResponse<BusinessGroup[]>) => {
        this.businessGroups = [...res.data];
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

  getPatientDetails(param: string) {
    this.ceService.getpatientByIdUser(param).subscribe({
      next: (res: DefaultResponse<PatientDetails>) => {
        this.settlementSearch = res.data.asentamiento;
        this.searchSettlements();
        this.getFederalEntity();


        res.data.email = this.removeAccents(res.data.email);

        this.user = this.mapToUserDetails(res.data);
        this.patient = this.mapToPatient(res.data);

        this.userForm = this.createUserForm();
        this.patientForm = this.createPatientForm();

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
      idTipoUsuario: [this.UserRole.Paciente],
      idGEMP: [this.userData.role === 'Medico' ? this.userData.GEMP : this.user.idGEMP],
      idSucursal: [this.userData.role === 'Medico' ? this.userData.IdSucursal : this.user.idSucursal],
      nombres: [this.user.nombres],
      primerApellido: [this.user.primerApellido],
      segundoApellido: [this.user.segundoApellido],
      idAsentamiento: [this.user.idAsentamiento],
      domicilio: [this.user.domicilio],
      movil: [this.user.movil],
      email: [this.user.email],
      settlementSearch: [this.settlementSearch]
    });
  }

  createPatientForm(): UntypedFormGroup {
    return this.fb.group({
      ...(this.param && { idPaciente: [this.patient.idPaciente] }),
      genero: [this.patient.genero],
      idUsuario: [this.patient.idUsuario],
      fechaNacimiento: [this.patient.fechaNacimiento],
      idEntidadNacimiento: [String(this.patient.idEntidadNacimiento)],
      alergias: [this.patient.alergias],
      molecules: [this.patient.molecules],
      patologias: [this.patient.patologias],
    });
  }

  mapToUserDetails(response: any): UserDetails {
    this.getBranchesByGemp(response.idGEMP);
    const userDetails = new UserDetails(this.blankObjectUser);
    userDetails.idUsuario = response.idUsuario;
    userDetails.password = response.password;
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

  mapToPatient(response: any): PatientDetails {
    const patient = new PatientDetails(this.blankObject);
    patient.genero = response.genero;
    patient.idPaciente = response.idPaciente;
    patient.idUsuario = response.idUsuario;
    patient.fechaNacimiento = response.fechaNacimiento;
    patient.idEntidadNacimiento = response.idEntidadNacimiento;
    patient.alergias = response.alergias;
    patient.molecules = response.molecules;
    patient.patologias = response.patologias;
    return this.setDisplayEditPatient(patient);
  }

  public confirmAdd(): void {
    const userData = this.userForm.getRawValue();
    delete userData.settlementSearch;

    this.patientForm.patchValue({'alergias': this.patient.alergias});
    this.patientForm.patchValue({'molecules': this.patient.molecules});
    this.patientForm.patchValue({'patologias': this.patient.patologias});

    this.adminService.createUpdateUser(userData).subscribe({
      next: (res: DefaultResponse<CreateUserResponse>) => {

        if (!this.param) {
          this.patientForm.patchValue({'idUsuario': res.data.idUsuario});
        }
        this.patientService.createUpdatePatient(this.patientForm.getRawValue(), this.param).subscribe({
          next: () => {
            this.gfs.showAlert(this.param ? 'Paciente actualizado con éxito' : 'Paciente creado con éxito.', 'Correcto!');
            this.router.navigate(['patient/patient-list']).then();

          },
          error: (err: HttpErrorResponse) => {
            this.gfs.showErrorAlert('Hubo un error al Crear/editar el Paciente', err);
          },
        });
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

  searchAllergiesByKeyPress(event: Event) {
    this.keyPressAllergy$.next(event);
  }

  searchMolesculesByKeyPress(event: Event) {
    this.keyPressMolecule$.next(event);
  }

  searchPatologiesByKeyPress(event: Event) {
    this.keyPressPatology$.next(event);
  }

  displayFnAllergy(allergy: Allergy): string {
    return allergy && allergy.nameAllergy ? allergy.nameAllergy : '';
  }

  displayFnMolescules(molescule: Molecule): string {
    return molescule && molescule.nameMolecule ? molescule.nameMolecule : '';
  }

  displayFnPatologies(patology: Patology): string {
    return patology && patology.nameCIM10 ? patology.nameCIM10 : '';
  }

  setSelectedAllergy(value: Allergy) {
    if (value) {
      if (!this.patient.alergias) {
        this.patient.alergias = [];
      }

      const exists = this.patient.alergias.find((a) => a == String(value.idAllergy));

      if (!exists) {
        this.patient.alergias.push(String(value.idAllergy));
        this.allergiesNames.push(value.nameAllergy);

        this.searchAllergies = '';
      }
    }
  }

  setSelectedPatology(value: Patology) {
    if (value) {
      if (!this.patient.patologias) {
        this.patient.patologias = [];
      }

      const exists = this.patient.patologias.find((a) => a == String(value.idCIM10));

      if (!exists) {
        this.patient.patologias.push(String(value.idCIM10));
        this.patologiesNames.push(value.nameCIM10);

        this.searchPatologies = '';
      }
    }
  }

  setSelectedMolecule(value: Molecule) {
    if (value) {
      if (!this.patient.molecules) {
        this.patient.molecules = [];
      }

      const exists = this.patient.molecules.find((a) => a == String(value.idMolecule));

      if (!exists) {
        this.patient.molecules.push(String(value.idMolecule));
        this.molesculesNames.push(value.nameMolecule);

        this.searchMolescule = '';
      }

    }
  }

  searchAllergiesByName() {
    if (!this.searchAllergies) {
      this.allergies = [];

      return;
    }
    this.catalogsService.getAllergiesByName(this.searchAllergies).subscribe({
      next: (res: DefaultResponse<Allergy[]>) => {
        this.allergies = [...res.data];
      },
    });
  }

  searchMolesculesByName() {
    if (!this.searchMolescule) {
      this.molescules = [];

      return;
    }

    this.catalogsService.getMolesculesByName(this.searchMolescule).subscribe({
      next: (res: DefaultResponse<Molecule[]>) => {
        this.molescules = [...res.data];
      },
    });
  }

  searchPatologiesByName() {
    if (!this.searchPatologies) {
      this.patologies = [];

      return;
    }

    this.catalogsService.getPatologiessByName(this.searchPatologies).subscribe({
      next: (res: DefaultResponse<Patology[]>) => {
        this.patologies = [...res.data];
      },
    });
  }

  onDateChange(event: any): void {
    const date = event.value;
    if (date instanceof Date) {
      this.userForm.patchValue({
        fechaNacimiento: this.formatDate(date)
      });
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  setDisplayEditPatient(patient: PatientDetails): PatientDetails {
    const allergies: Allergy[] = patient.alergias;
    const molecules: Molecule[] = patient.molecules;
    const patologias: Patology[] = patient.patologias;

    const allergiesIds: string[] = [];
    const moleculesIds: string[] = [];
    const patologiasIds: string[] = [];
    const allergiesNames: string[] = [];
    const molesculesNames: string[] = [];
    const patologiesNames: string[] = [];

    allergies.forEach(allergy => {
      allergiesIds.push(String(allergy.idAllergy));
      allergiesNames.push(allergy.name!);
    });

    molecules.forEach(molecule => {
      moleculesIds.push(String(molecule.idMolecule));
      molesculesNames.push(molecule.name!);
    });

    patologias.forEach(patology => {
      patologiasIds.push(String(patology.idCIM10));
      patologiesNames.push(patology.name!);
    });

    patient.alergias = allergiesIds;
    patient.molecules = moleculesIds;
    patient.patologias = patologiasIds;

    this.allergiesNames = allergiesNames;
    this.molesculesNames = molesculesNames;
    this.patologiesNames = patologiesNames;
    return patient;
  }

  removeMolecule(index: number): void {
    this.molesculesNames.splice(index, 1);
    this.patient.molecules.splice(index, 1);
  }

  removeAllergy(index: number): void {
    this.allergiesNames.splice(index, 1);
    this.patient.alergias.splice(index, 1);
  }

  removePatology(index: number): void {
    this.patologiesNames.splice(index, 1);
    this.patient.patologias.splice(index, 1);
  }
}
