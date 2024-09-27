import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { Patient } from '@core/models/Patient';
import { CatalogsService } from '@core/http/catalogs.service';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { Allergy } from '@core/models/Allergy';
import { Molecule } from '@core/models/Molescule';
import { Patology } from '@core/models/Patology';
import {Medicament} from "@core/models/Medicament";

@Component({
  selector: 'app-prescription-edit-create',
  standalone: true,
  imports: [
    BreadcrumbComponent,
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
    MatDatepickerModule,
    MatCheckboxModule,
    MatListModule,
  ],
  templateUrl: './prescription-edit-create.component.html',
  styleUrl: './prescription-edit-create.component.scss',
})
export class PrescriptionEditCreateComponent implements OnInit {
  keyPressPatology$ = new Subject();
  keyPressAllergy$ = new Subject();
  keyPressMolecule$ = new Subject();
  keyPressMedicament$ = new Subject();

  patient: Patient;

  /* Catalogs */
  allergies: Allergy[];
  molescules: Molecule[];
  medicament: Medicament[];
  patologies: Patology[];

  /* Search inputs */
  searchAllergies: string;
  searchMolescule: string;
  searchMedicament: string;
  searchPatologies: string;

  constructor(private catalogsService: CatalogsService) {
    this.patient = new Patient();

    this.searchAllergies = '';
    this.searchMolescule = '';
    this.searchMedicament = '';
    this.searchPatologies = '';

    this.allergies = [];
    this.molescules = [];
    this.medicament = [];
    this.patologies = [];
  }

  ngOnInit(): void {
    this.keyPressMolecule$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchMolesculesByName();
        })
      )
      .subscribe();

    this.keyPressMedicament$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchMolesculesByName();
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

    this.keyPressAllergy$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.searchAllergiesByName();
        })
      )
      .subscribe();
  }

  searchAllergiesByKeyPress() {
    this.keyPressAllergy$.next(event);
  }

  searchMolesculesByKeyPress() {
    this.keyPressMolecule$.next(event);
  }

  searchPatologiesByKeyPress() {
    this.keyPressPatology$.next(event);
  }

  searchMedicamentsByKeyPress() {
    this.keyPressMedicament$.next(event);
  }

  displayFn(allergy: Allergy): string {
    return allergy && allergy.name ? allergy.name : '';
  }

  setSelectedAllergy(value: Allergy) {
    if (value) {
      if (!this.patient.alergias) {
        this.patient.alergias = [];
      }

      const exists = this.patient.alergias.find((a) => a == value.name);

      if (!exists) {
        this.patient.alergias.push(value.name);

        this.searchAllergies = '';
      }
    }
  }

  setSelectedPatology(value: Patology) {
    if (value) {
      if (!this.patient.patologias) {
        this.patient.patologias = [];
      }

      const exists = this.patient.patologias.find((a) => a == value.name);

      if (!exists) {
        this.patient.patologias.push(value.name);

        this.searchPatologies = '';
      }
    }
  }

  setSelectedMolecule(value: Molecule) {
    if (value) {
      if (!this.patient.molecules) {
        this.patient.molecules = [];
      }

      const exists = this.patient.molecules.find((a) => a == value.name);

      if (!exists) {
        this.patient.molecules.push(value.name);

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
    if (!this.searchMedicament) {
      this.molescules = [];

      return;
    }

    this.catalogsService.getMolesculesByName(this.searchMolescule).subscribe({
      next: (res: DefaultResponse<Molecule[]>) => {
        this.molescules = [...res.data];
      },
    });
  }

  searchMedicamentsByName() {
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

        console.log(this.patologies);
      },
    });
  }
}
