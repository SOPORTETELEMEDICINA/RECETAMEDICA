import {NgClass} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {BreadcrumbComponent} from '@shared/components/breadcrumb/breadcrumb.component';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {CatalogsService} from '@core/http/catalogs.service';
import {DefaultResponse} from '@core/models/Http/DefaultResponse';
import {BehaviorSubject, debounceTime, distinctUntilChanged, Subject, tap} from 'rxjs';
import {Allergy} from '@core/models/Allergy';
import {Molecule} from '@core/models/Molescule';
import {Patology} from '@core/models/Patology';
import {Medicament} from '@core/models/Medicament';
import {MatTooltip} from "@angular/material/tooltip";
import {PrescriptionSearch} from "@core/models/PrescriptionSearch";
import {PrescriptionLine} from "@core/models/PrescriptionLine";
import {PrescriptionLineService} from "@core/http/table-data-services/prescription-lines.service";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatRipple} from "@angular/material/core";
import {MatSort} from "@angular/material/sort";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {MatDialog} from "@angular/material/dialog";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {PrescriptionLineComponent} from "../prescription-line/prescription-line.component";
import {PatientDetails} from "@core/models/PatientDetails";
import {PatientLine} from "@core/models/PatientLine";
import {PatientLineService} from "@core/http/table-data-services/patient-line.service";
import {SelectionModel} from "@angular/cdk/collections";
import {UserRole} from "@core/models/Enums/UserRole";
import {CreateEditService} from "@core/http/create-edit-service";
import {DoctorDetails} from "@core/models/DoctorDetails";
import {Router} from "@angular/router";
import {PatientHistoryService} from "@core/http/table-data-services/patient-history.service";
import {MatIcon} from "@angular/material/icon";
import Swal from "sweetalert2";
import {XMLParser} from "fast-xml-parser";
import {AlertsListComponent} from "../alerts-list/alerts-list.component";
import {UppercaseNoAccentDirective} from "@shared/directives/uppercase-no-accent.directive";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Component({
  selector: 'app-prescription-edit-create',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    MatError,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatSuffix,
    MatCheckbox,
    MatIconButton,
    MatTooltip,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRipple,
    MatSort,
    FeatherIconsComponent,
    NgClass,
    MatIcon,
    MatFabButton,
    UppercaseNoAccentDirective,
  ],
  templateUrl: './prescription-edit-create.component.html',
  styleUrl: './prescription-edit-create.component.scss',
})
export class PrescriptionEditCreateComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  @ViewChild('iframe', {static: false}) iframe!: ElementRef;

  idMedico?: string;
  prescriptionForm: UntypedFormGroup

  prescription: PrescriptionSearch;
  prescriptionLine: PrescriptionLine;
  patient: PatientDetails;
  patientLine: PatientLine;
  blankObject = {} as PrescriptionSearch;
  blankObjectLine = {} as PrescriptionLine;
  blankObjectPatient = {} as PatientDetails;
  blankObjectPatientLine = {} as PatientLine;

  allergies: Allergy[];
  molescules: Molecule[];
  patologies: Patology[];
  medicaments: Medicament[];
  patients: PatientDetails[];
  history: PatientLine[];

  searchPatients: string;
  htmlContent: string = '';

  keyPressAllergy$ = new Subject();
  keyPressPatology$ = new Subject();
  keyPressMedicament$ = new Subject();
  keyPressPatient$ = new Subject();

  patologiesNames: string[];
  molesculesNames: string[];
  allergiesNames: string[];
  medicamentNames: string[];

  isGenderRestricted: boolean = false;
  isPregnant: boolean = false;
  isPatientLoaded: boolean = false;
  hasRelevantHistory: boolean = false;
  dataLoaded = false;
  analysisBacked = false;
  havePosted = false;

  prescriptionDataSource = new BehaviorSubject<PrescriptionLine[]>([]);
  patientDataSource = new BehaviorSubject<PatientLine[]>([]);
  patientHistoryDataSource = new BehaviorSubject<PatientLine[]>([]);
  selection = new SelectionModel<PatientLine>(true, []);

  alertas: any;
  alertasControl: number = 0;

  displayedColumnsPatients: string[] = [
    'tipo',
    'nombre',
    'cronico',
    'idCode',
    'actions',
  ];

  displayedColumnsHistory: string[] = [
    'tipo',
    'nombre',
    'idCode',
  ];

  displayedColumns: string[] = [
    'drugType',
    'drug',
    'dose',
    'frecuency',
    'duration',
    'route',
    'indication',
    'obs',
    'actions',
  ];

  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  medicamentoActivo: [] = [];


  constructor(
    private prescriptionService: PrescriptionLineService,
    private patientService: PatientLineService,
    private patientHistoryService: PatientHistoryService,
    private catalogsService: CatalogsService,
    private gfs: GeneralFunctionsService,
    private router: Router,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private ceService: CreateEditService
  ) {
    super();

    this.prescription = new PrescriptionSearch(this.blankObject);
    this.prescriptionLine = new PrescriptionLine(this.blankObjectLine);
    this.patient = new PatientDetails(this.blankObjectPatient);
    this.patientLine = new PatientLine(this.blankObjectPatientLine);
    this.prescriptionForm = this.createPrescriptionForm()

    this.allergies = [];
    this.molescules = [];
    this.patologies = [];
    this.medicaments = [];
    this.patients = [];
    this.history = [];

    this.searchPatients = '';

    this.patologiesNames = [];
    this.molesculesNames = [];
    this.allergiesNames = [];
    this.medicamentNames = [];

    const userDetails = JSON.parse(<string>localStorage.getItem('userDetails'));
    if (userDetails.idTipoUsuario == UserRole.Medico) {
      this.ceService.getDoctorByIdUser(userDetails.idUsuario).subscribe({
        next: (res: DefaultResponse<DoctorDetails>) => {
          this.idMedico = res.data.idMedico;
        },
      });
    }
  }

  ngOnInit(): void {
    this.prescriptionDataSource = this.prescriptionService.dataChange;
    this.patientDataSource = this.patientService.dataChange;
    this.patientHistoryDataSource = this.patientHistoryService.dataChange;

    this.prescriptionService.resetPrescriptionDataSource();
    this.patientService.resetDataSource();
    this.patientHistoryService.resetDataSource();
    this.medicamentoActivo = [];
    this.havePosted = false;
    this.analysisBacked = false;

    this.prescriptionForm.get('gender')?.valueChanges.subscribe((value) => {
      this.updateDependentFields(value);
    });

    this.prescriptionForm.get('pregnancy')?.valueChanges.subscribe((isPregnant) => {
      this.handlePregnancyChange(isPregnant);
    });


    this.prescriptionService.getHtmlResponse().subscribe(htmlResponse => {
      this.openHtmlModal(htmlResponse);
    });
    this.keyPressAllergy$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          if (this.isValidSearchTerm(this.prescriptionForm.get('searchAllergies')?.value)) {
            this.searchAllergiesByName()
          }
        })
      )
      .subscribe();

    this.keyPressPatology$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          if (this.isValidSearchTerm(this.prescriptionForm.get('searchPatologies')?.value)) {
            this.searchPatologiesByName()
          }
        })
      )
      .subscribe();

    this.keyPressMedicament$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          if (this.isValidSearchTerm(this.prescriptionForm.get('searchMedicaments')?.value)) {
            this.searchMedicamentsByName()
          }
        })
      )
      .subscribe();

    this.keyPressPatient$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
            if (this.isValidSearchTerm(this.searchPatients)) {
              this.searchPatientByName()
            } else {
              this.patient = new PatientDetails(this.blankObjectPatient);
              this.isPatientLoaded = false;
            }
          }
        )
      )
      .subscribe();
  }

  checkRelevantHistory(patient: PatientDetails): boolean {
    return (
      patient?.molecules?.length > 0 ||
      patient?.alergias?.length > 0 ||
      patient?.patologias?.length > 0
    );
  }

  // noinspection JSUnusedGlobalSymbols
  ngAfterViewChecked(): void {
    if (this.dataLoaded && this.iframe) {
      const iframeElement = this.iframe.nativeElement as HTMLIFrameElement;
      const iframeDocument = iframeElement.contentDocument || iframeElement.contentWindow?.document;

      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(this.htmlContent);
        iframeDocument.close();
      }
    }
  }

  openHtmlModal(html: string): void {
    this.htmlContent = html;
    this.dataLoaded = true;
  }

  backToDefault(): void {
    this.dataLoaded = false;
    this.analysisBacked = true;
    this.htmlContent = '';
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : this.formControl.hasError('email')
        ? 'Correo invalido'
        : 'Error'
  }

  createPrescriptionForm(): UntypedFormGroup {
    return this.fb.group({
      gender: [null],
      dateOfBirth: [null],
      weight: [null],
      height: [null],
      breastFeeding: [null],
      weeksOfAmenorrhea: [null],
      pregnancy: [false],
      creatin: [null],
      molecules: [[]],
      allergies: [[]],
      pathologies: [[]],

      age: [null],
      medicaments: [null],
      searchMoleculesChecked: [true],
      searchAllergiesChecked: [true],
      searchPatologies: [''],
      searchAllergies: [''],
      searchMedicaments: ['']
    });
  }

  onAgeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const age = parseInt(inputElement.value, 10);

    this.convertAgeToDoB(age);
  }

  searchAllergiesByKeyPress(event: Event) {
    this.keyPressAllergy$.next(event);
  }

  searchPatologiesByKeyPress(event: Event) {
    this.keyPressPatology$.next(event);
  }

  searchMedicamentsByKeyPress(event: Event) {
    this.keyPressMedicament$.next(event);
  }

  searchPatientsByKeyPress(event: Event) {
    this.keyPressPatient$.next(event);
  }

  displayFnAllergy(option: any): string {
    return option && option.nameAllergy
      ? option.nameAllergy
      : (option.nameMolecule ? option.nameMolecule : '');
  }

  displayFnPatologies(patology: Patology): string {
    return patology && patology.nameCIM10 ? patology.nameCIM10 : '';
  }

  displayFnMedicaments(medicament: Medicament): string {
    return medicament && medicament.nombre ? medicament.nombre : '';
  }

  displayFnPatients(patient: PatientDetails): string {
    return patient && patient.nombres ?
      patient.nombres + ' ' + patient.primerApellido + ' ' + patient.segundoApellido : '';
  }

  setSelectedAllergy(value: any) {
    if (value) {

      if (value) {
        if (!this.history) {
          this.history = [];
        }
        const exists = this.history.find((a) => a == value);

        if (!exists) {
          this.history.push(value);
          this.addNewPatientLine(value);
          this.prescriptionForm.patchValue({'searchAllergies': ''})
        }
      }
    }
  }

  setSelectedPatology(value: any) {
    if (value) {

      if (value) {
        if (!this.history) {
          this.history = [];
        }
        const exists = this.history.find((a) => a == value);

        if (!exists) {
          this.history.push(value);
          this.addNewPatientLine(value);
          this.prescriptionForm.patchValue({'searchPatologies': ''})
        }
      }
    }
  }

  setSelectedMedicamente(value: Medicament) {
    if (this.prescriptionService.isLineValid()) {
      if (value) {
        if (!this.prescription.medicamentos) {
          this.prescription.medicamentos = [];
        }

        const exists = this.prescription.medicamentos.find((a) => a == String(value.id));

        if (!exists) {
          this.prescription.medicamentos.push(String(value.id));
          this.medicamentNames.push(value.nombre);
          this.addNewLine(value);
        }
      }
    } else {
      Swal.fire('Advertencia', 'Favor de llenar los datos del medicamento anterior, gracias.', 'warning').then(() => {
        this.prescriptionForm.patchValue({'searchMedicaments': ''})

      });
    }

  }

  setSelectedPatient(value: PatientDetails) {
    if (value) {
      this.searchPatients = this.gfs.mayusAcentos(this.searchPatients);
      const cleanData = this.gfs.mayusAcentos(value);
      console.log(cleanData)
      this.prescriptionService.resetPrescriptionDataSource();
      this.patientService.resetDataSource();
      this.patientHistoryService.resetDataSource();
      this.analysisBacked = false;
      this.havePosted = false;
      this.medicamentoActivo = [];
      this.selection.clear();

      this.patient = cleanData;
      this.prescriptionForm.patchValue({'gender': cleanData.genero == 'M' ? 'MALE' : 'FEMALE'});
      this.prescriptionForm.patchValue({'age': cleanData.edad});
      this.updateDateOfBirthFromAge(cleanData.edad);

      this.checkAlertsControl();
      if (!this.hasRelevantHistory) {
        this.hasRelevantHistory = this.checkRelevantHistory(cleanData);
      }
      if (!this.isPatientLoaded) {
        this.isPatientLoaded = true;
      }

      if (cleanData.patologias.length > 0) {
        this.processDetailLines(cleanData.patologias, 'Patologia', 'idCIM10', 3);
      }

      if (cleanData.alergias.length > 0) {
        this.processDetailLines(cleanData.alergias, 'Alergia', 'idAllergy', 1);
      }

      if (cleanData.molecules.length > 0) {
        this.processDetailLines(value.molecules, 'Molecula', 'idMolecule', 2);
      }
    }
  }

  updateDateOfBirthFromAge(age: number): void {
    this.convertAgeToDoB(age);
  }

  processDetailLines(details: any[], type: string, idField: string, codeField: number): void {
    details.forEach(obj => {
      const newLine: PatientLine = new PatientLine({
        detailType: type,
        detailTypeName: obj.name,
        cronical: false,
        detailTypeId: obj[idField],
        type: codeField,
        detailTypeCode: obj.code || '',
      });
      this.patientHistoryService.addPatientLine(newLine);
    });
  }

  searchAllergiesByName() {
    if (!this.prescriptionForm.get('searchAllergies')?.value) {
      this.clearAlergies();

      return;
    }

    if (this.prescriptionForm.get('searchAllergiesChecked')?.value) {
      this.catalogsService.getAllergiesByName(this.prescriptionForm.get('searchAllergies')?.value).subscribe({
        next: (res: DefaultResponse<Allergy[]>) => {
          this.allergies = res.data.map(allergy => ({
            ...allergy,
            type: 1
          }));
        },
      });
    }
    if (this.prescriptionForm.get('searchMoleculesChecked')?.value) {
      this.catalogsService.getMolesculesByName(this.prescriptionForm.get('searchAllergies')?.value).subscribe({
        next: (res: DefaultResponse<Molecule[]>) => {
          this.molescules = res.data.map(molecule => ({
            ...molecule,
            type: 2
          }));
        },
      });
    }
  }

  clearAlergies() {
    this.allergies = [];
    this.molescules = [];
    this.prescriptionForm.patchValue({'searchAllergies': ''})
  }

  searchPatologiesByName() {
    if (!this.prescriptionForm.get('searchPatologies')?.value) {
      this.patologies = [];

      return;
    }

    this.catalogsService.getPatologiessByName(this.prescriptionForm.get('searchPatologies')?.value).subscribe({
      next: (res: DefaultResponse<Patology[]>) => {
        this.patologies = res.data.map(pathology => ({
          ...pathology,
          type: 3
        }));
      },
    });
  }

  searchMedicamentsByName() {
    if (!this.prescriptionForm.get('searchMedicaments')?.value) {
      this.patologies = [];

      return;
    }

    this.catalogsService.getMedicamentsByName(this.prescriptionForm.get('searchMedicaments')?.value).subscribe({
      next: (res: DefaultResponse<Medicament[]>) => {
        this.medicaments = [...res.data];
      },
    });
  }

  searchPatientByName() {

    this.catalogsService.getPatientsByName(this.searchPatients).subscribe({
      next: (res: DefaultResponse<PatientDetails[]>) => {
        this.patients = [...res.data];
      },
    });
  }

  updateDependentFields(gender: string): void {
    if (gender === 'MALE') {
      this.isGenderRestricted = true;
      this.prescriptionForm.get('weeksOfAmenorrhea')?.reset();
      this.prescriptionForm.get('pregnancy')?.reset();
      this.prescriptionForm.get('breastFeeding')?.reset();

      this.prescriptionForm.get('weeksOfAmenorrhea')?.disable();
      this.prescriptionForm.get('pregnancy')?.disable();
      this.prescriptionForm.get('breastFeeding')?.disable();
    } else {
      this.isGenderRestricted = false;
      this.prescriptionForm.get('weeksOfAmenorrhea')?.enable();
      this.prescriptionForm.get('pregnancy')?.enable();
      this.prescriptionForm.get('breastFeeding')?.enable();
    }
  }

  onGenderChange(gender: string): void {
    this.updateDependentFields(gender);
  }

  handlePregnancyChange(isPregnant: boolean): void {
    this.isPregnant = isPregnant;
    const weeksControl = this.prescriptionForm.get('weeksOfAmenorrhea');

    if (isPregnant) {
      weeksControl?.setValue(1);
      weeksControl?.enable();
    } else {
      weeksControl?.setValue(null);
      if (this.isGenderRestricted) {
        weeksControl?.disable();
      }
    }
  }

  addNewLine(value: Medicament): void {

    const newLine: PrescriptionLine = new PrescriptionLine({
      drugType: value.idType,
      drug: value.id,
      dose: null,
      unitId: null,
      frequencyType: '',
      duration: null,
      durationType: '',
      route: null,
      indication: '',
      name: value.nombre,
      summary: value.summary,
      indicationName: '',
      frecuency: '',
      obs: '',
      unitIdName: '',
      durationName: '',
      routeName: ''
    });
    const cleanData = this.gfs.mayusAcentos(newLine);
    const index = this.prescriptionService.addPrescriptionLine(cleanData);
    this.updateLine(newLine, index);
    this.prescriptionForm.patchValue({'searchMedicaments': ''})
    this.medicaments = [];
  }

  addNewPatientLine(value: any): void {
    let {type, name, id, code} = this.generateNewLine(value);

    const newLine: PatientLine = new PatientLine({
      detailType: type,
      detailTypeName: name,
      cronical: false,
      detailTypeId: id,
      type: value.type,
      detailTypeCode: code,
    });

    this.patientService.addPatientLine(newLine);

  }

  updateLine(toUpdate: PrescriptionLine, index: number): void {
    const {drug, drugType, name, summary} = toUpdate;
    this.prescriptionService.getRelations(drug, drugType).subscribe({
      next: (data) => {

        this.gfs.mayusAcentos(data);

        const dialogRef = this.dialog.open(PrescriptionLineComponent, {
          maxWidth: 'none',
          data: {
            routes: data.routes,
            indications: data.indications,
            units: data.units,
            name,
            summary,
            toUpdate
          },
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            toUpdate.dose = result.dose;
            toUpdate.unitId = result.unitId;
            toUpdate.frequencyType = result.frequencyType;
            toUpdate.duration = result.duration;
            toUpdate.durationType = result.durationType;
            toUpdate.route = result.route;
            toUpdate.indication = result.indication;
            toUpdate.indicationName = result.indicationName;
            toUpdate.frecuency = result.frecuency;
            toUpdate.obs = result.obs;
            toUpdate.unitIdName = result.unitIdName;
            toUpdate.durationName = result.durationName;
            toUpdate.routeName = result.routeName;

            const cleanData = this.gfs.mayusAcentos(toUpdate);
            await this.prescriptionService.updatePrescriptionLine(index, cleanData);
            await this.confirmAdd(2);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching relations:', err);
      },
    });
  }

  deleteLine(index: number): void {
    this.medicamentNames.splice(index, 1);
    this.prescription.medicamentos.splice(index, 1);
    this.prescriptionService.deletePrescriptionLine(index);
    this.checkAlertsControl();
    if (this.medicamentNames.length > 0) {
      this.confirmAdd(2).then();
    } else {
      this.alertasControl = 0;
      this.alertas = []
    }
  }

  deletePatientLine(index: number): void {
    this.patientService.deletePatientLine(index);
    this.history.splice(index, 1);
  }

  calculatePeriodEndDate(duration: number, durationType: string): string {
    const today = new Date();
    let resultDate = new Date(today);

    switch (durationType) {
      case 'YEAR':
        resultDate.setFullYear(today.getFullYear() + duration);
        break;
      case 'MONTH':
        resultDate.setMonth(today.getMonth() + duration);
        break;
      case 'WEEK':
        resultDate.setDate(today.getDate() + duration * 7);
        break;
      case 'DAY':
        resultDate.setDate(today.getDate() + duration);
        break;
      case 'HOUR':
        resultDate.setHours(today.getHours() + duration);
        break;
      case 'MINUTE':
        resultDate.setMinutes(today.getMinutes() + duration);
        break;
    }

    return resultDate.toISOString();
  }

  public async confirmAdd(step = 1) {

    let {patologias, alergias, moleculas} = this.getdetailsAnalytics();

    const prescription = this.prescriptionForm.getRawValue();
    prescription.pregnancy = !!prescription.pregnancy;

    const prescriptionLines = this.prescriptionDataSource.getValue().map(line => ({
      drugType: line.drugType,
      drug: line.drug,
      dose: line.dose,
      unitId: line.unitId,
      frequencyType: line.frequencyType,
      duration: line.duration,
      durationType: line.durationType,
      route: line.route,
      indication: String(line.indication)
    }));

    const fullPrescription = {
      patient: {
        idPaciente: this.patient.idPaciente,
        gender: prescription.gender,
        dateOfBirth: prescription.dateOfBirth,
        weight: prescription.weight,
        height: prescription.height,
        breastFeeding: prescription.breastFeeding,
        weeksOfAmenorrhea: prescription.weeksOfAmenorrhea,
        pregnancy: prescription.pregnancy,
        creatin: prescription.creatin || 0,
        molecules: moleculas,
        allergies: alergias,
        pathologies: patologias,
      },
      prescriptionLines: prescriptionLines,
      medicamentoActivo: this.medicamentoActivo
    };

    const cleanData = this.gfs.mayusAcentos(fullPrescription);
    console.log(cleanData)
    switch (step) {
      case 1:
        this.prescriptionService.postToAnalytics(cleanData);
        break;
      case 2:
        this.prescriptionService.postToAnalyticsXML(cleanData).subscribe({
          next: (data: any) => {
            if (!this.havePosted) {
              this.havePosted = true
              this.medicamentoActivo = data.medicamentoActivo;
            }
            this.alertasControl = 0
            this.alertas = this.processXmlWithParser(data.xmlResponse);
            this.checkAlertsControl();
          }
        });
        break;
    }
  }

  processXmlWithParser(xmlString: string) {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    const jsonObj = parser.parse(xmlString);
    const data = jsonObj.feed.entry;
    if (!data) return [];

    const prescriptionLines = data.filter((entry: any) => entry.category?.term === "PRESCRIPTION_LINE");

    const alerts = data.filter((entry: any) => entry.category?.term === "ALERT");

    return prescriptionLines.map((line: any) => {
      const id = line.id;
      const drugId = line["vidal:drugId"];

      const severities = Object.entries(line)
        .filter(([key, value]: any) => key.startsWith("vidal:max") && value.severity !== "NO_ALERT")
        .map(([key, value]: [string, any]) => ({
          type: key,
          severity: value.severity,
          description: value["#text"],
        }));

      const relatedAlerts = alerts
        .filter(
          (alert: any) =>
            alert.link?.href === id && alert["vidal:severity"] === "LEVEL_4"
        )
        .map((alert: any) => ({
          title: alert.title,
          severity: alert["vidal:severity"],
          description: this.normalizeHtmlEntities(alert.content?.["#text"]),
          type: alert["vidal:alertType"]?.["#text"],
          subType: alert["vidal:subType"]?.["#text"],
          detail: alert["vidal:detail"]?.["#text"],
        }));

      return {
        id,
        drugId,
        title: line.title,
        severities,
        alerts: relatedAlerts,
      };
    });
  }

  public crearReceta() {
    let {patologias, alergias, moleculas} = this.createExtracted();
    let {patologiasCronicas, alergiasCronicas, moleculasCronicas} = this.cronicalExtracted();

    const today = new Date().toISOString();
    const prescription = this.prescriptionForm.getRawValue();
    prescription.pregnancy = !!prescription.pregnancy;
    prescription.breastFeeding = prescription.breastFeeding = !!'All';

    const prescriptionLines = this.prescriptionDataSource.getValue().map(line => ({
      idMedicamento: line.drug,
      tipoMedicamento: line.drugType,
      unidadDispensacionId: line.unitId,
      rutaAdministracionId: line.route,
      indicacion: String(line.indication),
      cantidadDiaria: line.dose,
      duracion: line.duration,
      unidadDuracion: line.durationType,
      periodoInicio: today,
      periodoTerminacion: this.calculatePeriodEndDate(line.duration!, line.durationType),
      indicacionNombre: line.indicationName,
      frecuencia: line.frecuency,
      observaciones: line.obs
    }));

    const fullPrescription = {
      idMedico: this.idMedico,
      idPaciente: this.patient.idPaciente,
      paciente: {
        peso: prescription.weight,
        talla: prescription.height,
        embarazo: prescription.pregnancy,
        semanasAmenorrea: prescription.weeksOfAmenorrhea,
        lactancia: prescription.breastFeeding,
        creatinina: prescription.creatin || 0,
        moleculas,
        alergias,
        patologias,
      },
      prescriptionLines: prescriptionLines,
      patologiasCronicas,
      alergiasCronicas,
      moleculasCronicas
    };

    const cleanData = this.gfs.mayusAcentos(fullPrescription);
    console.log(cleanData)
    this.prescriptionService.postToPrescription(cleanData).subscribe({
      next: () => {
        Swal.fire('Exito', 'Receta Creada Correctamente', 'success').then(() => {
          this.router.navigate(['prescription/prescription-list']).then();
        });
      },
      error: (err) => {
        console.error('Error al enviar crear receta:', err);
      }
    });
  }

  openPrescriptionLineModal(): void {
    const dialogRef = this.dialog.open(AlertsListComponent, {
      maxWidth: 'none',
      data: {
        alerts: this.alertas,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  normalizeHtmlEntities(input: string): string {
    const parser = new DOMParser();
    return parser.parseFromString(`<!doctype html><body>${input}`, 'text/html').body.textContent || '';
  }

  onBreastFeedingChange(event: MatCheckboxChange): void {
    const value = event.checked ? 'ALL' : 'NONE';
    this.prescriptionForm.get('breastFeeding')?.setValue(value);
  }

  private checkAlertsControl() {
    this.alertasControl = 0;
    if (this.alertas) {
      this.alertas.forEach((alerta: any) => {
        this.alertasControl += alerta.alerts.length;
      })
    } else {
      this.alertasControl = 0;
    }

  }

  private convertAgeToDoB(age: number) {
    if (!isNaN(age)) {
      const currentDate = new Date();
      const birthYear = currentDate.getFullYear() - age;
      const birthDate = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
      const isoDate = birthDate.toISOString().split('T')[0] + 'T00:00:00+00:00';

      this.prescriptionForm.patchValue({dateOfBirth: isoDate});
    }
  }

  private generateNewLine(value: any) {
    let type = '';
    let name = '';
    let id = 0;
    let code = '';

    switch (value.type) {
      case 1:
        type = 'Alergia';
        name = value.nameAllergy;
        id = value.idAllergy;
        break;
      case 2:
        type = 'Molecula';
        name = value.nameMolecule;
        id = value.idMolecule;
        break;
      case 3:
        type = 'Patologia';
        name = value.nameCIM10;
        id = value.idCIM10;
        code = value.code
        break;
    }
    return {type, name, id, code};
  }

  private cronicalExtracted() {
    let patologiasCronicas: number[] = [];
    let alergiasCronicas: number[] = [];
    let moleculasCronicas: number[] = [];

    this.selection.selected.forEach(value => {
      switch (value.type) {
        case 1:
          alergiasCronicas.push(value.detailTypeId)
          break;
        case 2:
          moleculasCronicas.push(value.detailTypeId)
          break;
        case 3:
          patologiasCronicas.push(value.detailTypeId)
          break;
      }
    });
    this.processDataSourceIds(this.patientHistoryDataSource, alergiasCronicas, moleculasCronicas, patologiasCronicas);

    return {patologiasCronicas, alergiasCronicas, moleculasCronicas};
  }

  private getdetailsAnalytics() {
    let patologias: (string | undefined)[] = [];
    let alergias: string[] = [];
    let moleculas: string[] = [];

    this.processDataSourceAnalytics(this.patientDataSource, alergias, moleculas, patologias);
    this.processDataSourceAnalytics(this.patientHistoryDataSource, alergias, moleculas, patologias);

    return {patologias, alergias, moleculas};
  }

  private processDataSourceAnalytics(
    dataSource: BehaviorSubject<PatientLine[]>,
    alergias: string[],
    moleculas: string[],
    patologias: (string | undefined)[]) {

    dataSource.getValue().forEach(value => {
      switch (value.type) {
        case 1:
          if (!alergias.includes(String(value.detailTypeId))) {
            alergias.push(String(value.detailTypeId));
          }
          break;
        case 2:
          if (!moleculas.includes(String(value.detailTypeId))) {
            moleculas.push(String(value.detailTypeId));
          }
          break;
        case 3:
          if (!patologias.includes(value.detailTypeCode)) {
            patologias.push(value.detailTypeCode);
          }
          break;
      }
    });
  }

  private createExtracted() {
    let patologias: number[] = [];
    let alergias: number[] = [];
    let moleculas: number[] = [];

    this.processDataSourceIds(this.patientDataSource, alergias, moleculas, patologias);

    return {patologias, alergias, moleculas};
  }

  private processDataSourceIds(
    dataSource: BehaviorSubject<PatientLine[]>,
    alergias: number[],
    moleculas: number[],
    patologias: number[]) {

    dataSource.getValue().forEach(value => {
      switch (value.type) {
        case 1:
          if (!alergias.includes(value.detailTypeId)) {
            alergias.push(value.detailTypeId);
          }
          break;
        case 2:
          if (!moleculas.includes(value.detailTypeId)) {
            moleculas.push(value.detailTypeId);
          }
          break;
        case 3:
          if (!patologias.includes(value.detailTypeId)) {
            patologias.push(value.detailTypeId);
          }
          break;
      }
    });
  }

  private isValidSearchTerm(term: string): boolean {
    return term?.length >= 4;
  }
}
