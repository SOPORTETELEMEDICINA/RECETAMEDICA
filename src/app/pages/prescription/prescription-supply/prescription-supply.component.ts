import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {PrescriptionService} from "@core/http/table-data-services/prescription.service";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {IReceta} from "@core/interfaces/receta-completa";
import {BehaviorSubject} from "rxjs";
import {SelectionModel} from "@angular/cdk/collections";
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
import {MatCheckbox} from "@angular/material/checkbox";
import {MatRipple} from "@angular/material/core";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {NgClass} from "@angular/common";
import {IDetalleReceta} from "@core/interfaces/receta-data";
import {RecetaCompletaService} from "@core/http/table-data-services/receta-completa.service";
import Swal from "sweetalert2";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";


@Component({
  selector: 'app-prescription-supply',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatDivider,
    ReactiveFormsModule,
    MatCheckbox,
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
    NgClass,
    MatSortHeader,
    TopWidgetsComponent

  ],
  templateUrl: './prescription-supply.component.html',
  styleUrl: './prescription-supply.component.scss'
})

export class PrescriptionSupplyComponent implements OnInit {
  searchPrescription: string = '';
  detalle: IReceta | undefined;

  detalleDataSource: BehaviorSubject<any[]> = new BehaviorSubject<IDetalleReceta[]>([]);
  selection = new SelectionModel<IDetalleReceta>(true, []);

  displayedColumns: string[] = [
    'nombre',
    'tipo',
    'cantidad',
    'motivo',
    'indicaciones',
    'actions',
  ];

  constructor(
    private prescriptionService: PrescriptionService,
    private recetaCompletaService: RecetaCompletaService,
    private gfs: GeneralFunctionsService
  ) {
  }

  ngOnInit(): void {
    this.detalleDataSource = this.recetaCompletaService.dataChange;
    this.recetaCompletaService.resetDataSource();
  }

  doSearch() {
    this.recetaCompletaService.resetDataSource();
    this.selection.clear();
    this.prescriptionService.getPrescriptionById(this.searchPrescription).subscribe({
      next: data => {
        this.detalle = data.data.receta
        data.data.detalles.forEach(value => this.addNewLine(value));
        if (data.data.detalles.length < 1) {
          Swal.fire('Atención', 'Receta ya surtida', 'info').then();
        }
      },
      error: err => {
        this.gfs.showErrorAlert('No se pudieron obtener los datos de las recetas.', err);
      }
    })
  }

  addNewLine(value: any): void {
    this.recetaCompletaService.addRecetaLine(value);
  }

  surtir() {
    let detallesReceta: string[] = [];
    this.selection.selected.forEach((value) => {
      detallesReceta.push(value.idDetalleReceta)
    })

    const full = {
      idReceta: this.detalle!.idReceta,
      detallesReceta
    }

    this.recetaCompletaService.postSurtir(full).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Receta Surtida Correctamente', 'success').then(() => {
          this.doSearch();
        });
      },
      error: (err) => {
        console.error('Error al enviar surtir receta:', err);
      }
    });
  }
}
