// noinspection DuplicatedCode

import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Entity} from "@core/models/Entity";
import {DefaultResponse} from "@core/models/Http/DefaultResponse";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogContent} from "@angular/material/dialog";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {CatService} from "@core/http/cat.service";
import {Township} from "@core/models/Township";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatRippleModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {PostalCodeService} from "@core/http/table-data-services/cp.service";
import {PostalCodeDataSource} from "@core/data-source/PostalCodeDataSource";
import {HttpClient} from "@angular/common/http";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {fromEvent} from "rxjs";

@Component({
  selector: 'app-postal-code-list',
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
  templateUrl: './postal-code-list.component.html',
  styleUrl: './postal-code-list.component.scss'
})
export class PostalCodeListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  data!: PostalCodeService;
  displayedColumns = ['cp', 'entidad', 'municipio'];
  dataSource!: PostalCodeDataSource;
  isDataLoaded: boolean = false;

  entidades: Entity[];
  entidadSeleccionada: Entity;

  municipios: Township[];
  municipioSeleccionado: Township;

  blankEntity = {} as Entity;
  blankTownship = {} as Township;

  constructor(
    private catService: CatService,
    public httpClient: HttpClient,
    private gfs: GeneralFunctionsService,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.entidades = [];
    this.municipios = [];
    this.entidadSeleccionada = this.blankEntity;
    this.municipioSeleccionado = this.blankTownship;
    this.data = new PostalCodeService(this.httpClient, this.gfs, this.catService);
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

  getMunicipiosByIdEntidad(idEntidad: number): void {
    this.catService.getMunicipiosByIdEntidad(idEntidad).subscribe({
      next: (res: DefaultResponse<Township[]>) => {
        this.municipios = [...res.data];

      },
      error: (err) => {
        this.gfs.showErrorAlert('Hubo un error al obtener los Municipios', err);
      },
    });
  }

  onEntidadSeleccionada(entidad: Entity) {
    if (entidad.idEntidad != 0) {
      this.municipioSeleccionado = this.blankTownship;
      this.getMunicipiosByIdEntidad(entidad.idEntidad);
      this.updateDataSource('Entity', entidad);
    }
  }

  onMunicipioSeleccionado(municipio: Township) {
    if (municipio.idMunicipio != 0) {
      this.updateDataSource('Township', this.entidadSeleccionada, municipio);
    }
  }

  limpiarSeleccion(): void {
    this.entidadSeleccionada = this.blankEntity;
    this.municipioSeleccionado = this.blankTownship;
    this.municipios = [];
    this.updateDataSource();
  }

  private initializeDataSource(
    searchType: string = '',
    entidad: Entity = this.blankEntity,
    municipio: Township = this.blankTownship
  ): PostalCodeDataSource {
    return new PostalCodeDataSource(this.data, this.paginator, this.sort, searchType, entidad, municipio);
  }

  private updateDataSource(
    searchType: string = '',
    entidad: Entity = this.blankEntity,
    municipio: Township = this.blankTownship
  ): void {
    this.isDataLoaded = false;
    this.dataSource = this.initializeDataSource(searchType, entidad, municipio);
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
