// noinspection DuplicatedCode

import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogContent} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRippleModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {Entity} from "@core/models/Entity";
import {CatService} from "@core/http/cat.service";
import {HttpClient} from "@angular/common/http";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {fromEvent} from "rxjs";
import {TownshipService} from "@core/http/table-data-services/township.service";
import {TownshipDataSource} from "@core/data-source/TownshipDataSource";

@Component({
  selector: 'app-township-list',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatButton,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatListModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './township-list.component.html',
  styleUrl: './township-list.component.scss'
})
export class TownshipListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  data!: TownshipService;
  displayedColumns = ['nombre', 'entidad'];
  dataSource!: TownshipDataSource;
  isDataLoaded: boolean = false;

  entidades: Entity[];
  entidadSeleccionada: Entity;

  blankEntity = {} as Entity;

  constructor(
    private catService: CatService,
    public httpClient: HttpClient,
    private gfs: GeneralFunctionsService,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.entidades = [];
    this.entidadSeleccionada = this.blankEntity;
    this.data = new TownshipService(this.httpClient, this.gfs);
  }

  ngOnInit(): void {
    this.catService.getEntities().subscribe({
      next: (res: DefaultResponse<Entity[]>) => {
        this.entidades = [...res.data];
      },
      error: (err) => {
        this.gfs.showErrorAlert('Hubo un error al obtener las entidades', err);
      },
    });
    this.dataSource = this.initializeDataSource();
    this.cd.detectChanges();
  }

  onEntidadSeleccionada(entidad: Entity) {
    if (entidad.idEntidad != 0) {
      this.updateDataSource(entidad);
    }
  }

  limpiarSeleccion(): void {
    this.entidadSeleccionada = this.blankEntity;
    this.updateDataSource();
  }

  private initializeDataSource(
    entidad: Entity = this.blankEntity,
  ): TownshipDataSource {
    return new TownshipDataSource(this.data, this.paginator, this.sort, entidad);
  }

  private updateDataSource(
    entidad: Entity = this.blankEntity,
  ): void {
    this.isDataLoaded = false;
    this.dataSource = this.initializeDataSource(entidad);
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter?.nativeElement.value;
      }
    );
    this.isDataLoaded = true;
    this.cd.detectChanges();
  }

}
