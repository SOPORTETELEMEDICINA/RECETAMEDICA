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
import {MatDivider} from "@angular/material/divider";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {NgClass} from "@angular/common";
import {Branch} from "@core/models/Branch";
import {Settlement} from "@core/models/Settlement";
import {debounceTime, distinctUntilChanged, Subject, tap} from "rxjs";
import {CatalogsService} from "@core/http/catalogs.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CreateEditService} from "@core/http/create-edit-service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {GEMP} from "@core/models/GEMP";
import {BranchService} from "@core/http/table-data-services/Branch.service";
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
    ReactiveFormsModule,
    NgClass,
    MatAutocompleteTrigger,
    MatAutocomplete,
    UppercaseNoAccentDirective
  ],
  templateUrl: './branch-edit-create.component.html',
  styleUrl: './branch-edit-create.component.scss',
})
export class BranchEditCreateComponent implements OnInit {
  gid: string | null = null;
  param: string | null = null;

  gemp: GEMP;
  branch: Branch;

  settlements: Settlement[];
  settlementSearch: string;

  keyPress$ = new Subject();

  branchForm: UntypedFormGroup;

  blankObject = {} as Branch;
  blankObjectGEMP = {} as GEMP;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  constructor(
    private catalogsService: CatalogsService,
    private gfs: GeneralFunctionsService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private branchService: BranchService,
    private ceService: CreateEditService,
  ) {
    this.branch = new Branch(this.blankObject);
    this.gemp = new GEMP(this.blankObjectGEMP);

    this.settlements = [];
    this.settlementSearch = '';

    this.route.paramMap.subscribe(params => {
      this.gid = params.get('gid');
      this.param = params.get('param');
    });

    this.branchForm = this.createBranchForm();
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : this.formControl.hasError('email')
        ? 'Correo invalido'
        : 'Error'
  }

  ngOnInit(): void {
    this.getGEMP();

    if (this.param) {
      this.getBranchDetails(this.param);
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

  getGEMP() {
    this.ceService.getGempbyIdGemp(this.gid).subscribe({
      next: (res: DefaultResponse<GEMP>) => {
        this.gemp = res.data;
      },
    });
  }

  getBranchDetails(param: string) {
    this.ceService.getBranchByIdBranch(param).subscribe({
      next: (res: DefaultResponse<Branch>) => {
        this.settlementSearch = res.data.nombreAsentamiento;

        this.searchSettlements();

        this.branch = this.mapToBranch(res.data);
        this.branchForm = this.createBranchForm();
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
            this.branchForm.patchValue({settlementSearch: selectedSettlement});
            this.branch.idAsentamiento = selectedSettlement.idAsentamiento;
          }
        },
      });
  }

  createBranchForm(): UntypedFormGroup {
    return this.fb.group({
      idGEMP: [this.branch.idGEMP],
      nombre: [this.branch.nombre],
      registroSanitario: [this.branch.registroSanitario],
      responsable: [this.branch.responsable],
      cedulaResponsable: [this.branch.cedulaResponsable],
      telefonoResponsable: [this.branch.telefonoResponsable],
      emailResponsable: [this.branch.emailResponsable],
      domicilio: [this.branch.domicilio],
      idAsentamiento: [this.branch.idAsentamiento],
      settlementSearch: [this.settlementSearch],
    });
  }

  mapToBranch(response: any): Branch {
    const branch = new Branch(this.blankObject);
    branch.idGEMP = response.idGEMP
    branch.nombre = response.nombre
    branch.registroSanitario = response.registroSanitario
    branch.responsable = response.responsable
    branch.cedulaResponsable = response.cedulaResponsable
    branch.telefonoResponsable = response.telefonoResponsable
    branch.emailResponsable = response.emailResponsable
    branch.domicilio = response.domicilio
    branch.idAsentamiento = response.idAsentamiento
    return branch;
  }

  public confirmAdd(): void {
    const branchData = this.branchForm.getRawValue();
    delete branchData.settlementSearch;

    if (this.param) {
      delete branchData.idGEMP;
    } else {
      branchData.idGEMP = this.gid;
    }

    this.branchService.createUpdateUser(branchData, this.param).subscribe({
      next: () => {
        this.gfs.showAlert(this.param ? 'Sucursal actualizada con éxito' : 'Sucursal creada con éxito.', 'Correcto!');
        this.router.navigate(['branch/branch-list']).then();
      },
      error: (err) => {
        this.gfs.showErrorAlert('Hubo un error al Crear/editar la Sucursal', err);
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
    this.branch.idAsentamiento = value ? value.idAsentamiento : 0;
    this.branchForm.patchValue({'idAsentamiento': this.branch.idAsentamiento});
  }

}
