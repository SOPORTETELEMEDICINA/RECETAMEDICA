import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {PatientDetails} from "@core/models/PatientDetails";
import {MatList, MatListItem} from "@angular/material/list";
import {NgForOf} from "@angular/common";

export interface DialogData {
  diagnostics: any;
}

@Component({
  selector: 'app-patient-diagnostics',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatList,
    MatListItem,
    NgForOf,
  ],
  templateUrl: './patient-diagnostics.component.html',
  styleUrl: './patient-diagnostics.component.scss'
})
export class PatientDiagnosticsComponent {
  dialogTitle: string;
  patient: PatientDetails;

  constructor(
    public dialogRef: MatDialogRef<PatientDiagnosticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.patient = data.diagnostics;
    this.dialogTitle = this.patient.nombres;
  }
}
