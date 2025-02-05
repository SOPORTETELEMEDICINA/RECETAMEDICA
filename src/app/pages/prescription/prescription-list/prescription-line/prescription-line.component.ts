import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {PrescriptionLine} from "@core/models/PrescriptionLine";
import {UppercaseNoAccentDirective} from "@shared/directives/uppercase-no-accent.directive";

@Component({
  selector: 'app-prescription-line',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    MatIconButton,
    MatDialogContent,
    MatPrefix,
    MatSuffix,
    MatCheckbox,
    UppercaseNoAccentDirective,
  ],
  templateUrl: './prescription-line.component.html',
  styleUrl: './prescription-line.component.scss'
})
export class PrescriptionLineComponent {
  dose: number;
  unitId: number;
  frequencyType = 'PER_24_HOURS';
  duration: number;
  durationType: string;
  route: number;
  indication: string;
  name: string;
  summary: string;
  frecuency: string;
  obs: string;

  [key: string]: any;

  isSingleDose: boolean = false;

  optionsDuration = [
    {value: "YEAR", label: "Año(s)"},
    {value: "MONTH", label: "Mes(es)"},
    {value: "WEEK", label: "Semana(s)"},
    {value: "DAY", label: "Día(s)"},
    {value: "HOUR", label: "Hora(s)"},
    {value: "MINUTE", label: "Minuto(s)"}
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      routes: any[];
      indications: any[];
      units: any[];
      name: string;
      summary: string;
      toUpdate: PrescriptionLine
    },
    private dialogRef: MatDialogRef<PrescriptionLineComponent>
  ) {
    this.name = data.name;
    this.summary = data.summary;

    const {toUpdate} = data;
    this.dose = toUpdate.dose || 0;
    this.unitId = toUpdate.unitId || 0;
    this.frequencyType = toUpdate.frequencyType || 'PER_24_HOURS';
    this.duration = toUpdate.duration || 0;
    this.durationType = toUpdate.durationType || '';
    this.route = toUpdate.route || 0;
    this.indication = toUpdate.indication || '';
    this.name = toUpdate.name || '';
    this.summary = toUpdate.summary || '';
    this.frecuency = toUpdate.frecuency || '';
    this.obs = toUpdate.obs || '';

    if (toUpdate.frecuency === 'Dosis Única') {
      this.isSingleDose = true;
      this.frecuency = '';
    } else if (toUpdate.frecuency?.startsWith('Cada')) {
      const match = toUpdate.frecuency.match(/Cada\s(.+?)\sHora\(s\)/);
      this.frecuency = match ? match[1] : '';
      this.isSingleDose = false;
    } else {
      this.frecuency = '';
      this.isSingleDose = false;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  toggleSingleDose(): void {
    if (this.isSingleDose) {
      this.frecuency = '';
    }
  }

  save(): void {
    const indicationName = this.data.indications.find(indication => indication.Id === this.indication).Name;
    const durationName = this.optionsDuration.find(opt => opt.value === this.durationType)?.label;
    const unitIdName = this.data.units.find(unit => unit.IdUnit === this.unitId).Name;
    const routeName = this.data.routes.find(route => route.IdRoute === this.route).Name;

    const posology = this.isSingleDose
      ? 'Dosis Única'
      : `Cada ${this.frecuency} Hora(s)`;

    this.dialogRef.close({
      dose: this.dose,
      unitId: this.unitId,
      frequencyType: 'PER_24_HOURS',
      duration: this.duration,
      durationType: this.durationType,
      route: this.route,
      indication: this.indication,
      indicationName,
      frecuency: posology,
      obs: this.obs,
      durationName,
      unitIdName,
      routeName,
    });
  }

  validateValue(property: string, value: number): void {
    if (value < 0) {
      this[property] = 0;
    } else {
      this[property] = value;
    }
  }
}
