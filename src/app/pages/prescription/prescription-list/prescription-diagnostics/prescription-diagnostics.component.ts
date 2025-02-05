import {Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {IAlergia, IDetalleReceta, IMolecula, IPatologia} from "@core/interfaces/receta-data";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatList, MatListItem} from "@angular/material/list";
import {NgForOf} from "@angular/common";

export interface DialogData {
  alergias: IAlergia[];
  moleculas: IMolecula[];
  patologias: IPatologia[];
  paciente: string;
}

@Component({
  selector: 'app-prescription-diagnostics',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogContent,
    MatList,
    MatListItem,
    NgForOf,
  ],
  templateUrl: './prescription-diagnostics.component.html',
  styleUrl: './prescription-diagnostics.component.scss'
})
export class PrescriptionDiagnosticsComponent {
  dialogTitle: string;
  alergias: IAlergia[] = [];
  moleculas: IMolecula[] = [];
  patologias: IPatologia[] = [];
  detalles!: IDetalleReceta[];

  constructor(
    public dialogRef: MatDialogRef<PrescriptionDiagnosticsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.alergias = data.alergias;
    this.moleculas = data.moleculas;
    this.patologias = data.patologias;
    this.dialogTitle = data.paciente;
  }
}
