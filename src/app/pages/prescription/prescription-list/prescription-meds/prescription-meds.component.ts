import {Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatList, MatListItem} from "@angular/material/list";
import {IDetalleReceta} from "@core/interfaces/receta-data";
import {MatDivider} from "@angular/material/divider";
import {NgIf} from "@angular/common";

export interface DialogData {
  detalles: IDetalleReceta[]
  dialogTitle: string;
}

@Component({
  selector: 'app-prescription-meds',
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
    MatDivider,
    NgIf,
  ],
  templateUrl: './prescription-meds.component.html',
  styleUrl: './prescription-meds.component.scss'
})
export class PrescriptionMedsComponent {
  dialogTitle: string = '';
  detalles: IDetalleReceta[] = []
  optionsDuration = [
    {value: "YEAR", label: "Año(s)"},
    {value: "MONTH", label: "Mes(es)"},
    {value: "WEEK", label: "Semana(s)"},
    {value: "DAY", label: "Día(s)"},
    {value: "HOUR", label: "Hora(s)"},
    {value: "MINUTE", label: "Minuto(s)"}
  ];

  constructor(
    public dialogRef: MatDialogRef<PrescriptionMedsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.detalles = data.detalles.map((value: IDetalleReceta) => ({
      ...value,
      unidadDuracion: this.getLabelByValue(value.unidadDuracion)
    }));
    this.dialogTitle = data.dialogTitle;

  }

  getLabelByValue(value: string): string {
    const option = this.optionsDuration.find(opt => opt.value === value);
    return option!.label;
  }
}
