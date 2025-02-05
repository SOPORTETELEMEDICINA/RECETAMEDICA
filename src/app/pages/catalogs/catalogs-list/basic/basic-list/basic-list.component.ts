import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule,} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogContent} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {debounceTime, distinctUntilChanged, Subject, tap} from "rxjs";
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
import {MedicamentService} from "@core/http/table-data-services/medicament.service";
import {MedicamentDataSource} from "@core/data-source/MedicamentDataSource";
import {HttpClient} from "@angular/common/http";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";

@Component({
  selector: 'app-basic-list',
  standalone: true,
  imports: [
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatListModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './basic-list.component.html',
  styleUrl: './basic-list.component.scss'
})
export class BasicListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  data: MedicamentService;
  displayedColumns = ['nombre', 'summary'];
  dataSource!: MedicamentDataSource;
  keyPressMedicament$ = new Subject();
  searchMedicament: string = '';
  isDataLoaded: boolean = false;

  constructor(
    public httpClient: HttpClient,
    private gfs: GeneralFunctionsService,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.data = new MedicamentService(this.httpClient, this.gfs);
  }

  ngOnInit(): void {
    this.keyPressMedicament$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.updateSearch(this.searchMedicament))
      )
      .subscribe();
    this.dataSource = this.initializeDataSource();
    this.cd.detectChanges()

  }

  searchMedicamentsByKeyPress(event: Event): void {
    this.keyPressMedicament$.next(event);
  }

  private initializeDataSource(name: string = ''): MedicamentDataSource {
    return new MedicamentDataSource(this.data, this.paginator, this.sort, name);
  }

  private updateSearch(term: string): void {
    this.isDataLoaded = false;

    if (this.isValidSearchTerm(term)) {
      this.dataSource = this.initializeDataSource(term);
      this.isDataLoaded = true;
    } else {
      this.resetSearch();
    }

    this.cd.detectChanges();
  }

  private resetSearch(): void {
    this.dataSource = this.initializeDataSource();
    this.isDataLoaded = false;
  }

  private isValidSearchTerm(term: string): boolean {
    return term?.length >= 4;
  }

}
