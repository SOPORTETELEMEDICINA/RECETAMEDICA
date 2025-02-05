import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRippleModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {UnsubscribeOnDestroyAdapter} from "@shared";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {fromEvent} from "rxjs";
import {EntityDataSource} from "@core/data-source/EntityDataSource";
import {EntityService} from "@core/http/table-data-services/entity.service";

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [
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
  templateUrl: './entity-list.component.html',
  styleUrl: './entity-list.component.scss'
})
export class EntityListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'nombre',
    'abreviatura'
  ];

  data?: EntityService;
  dataSource!: EntityDataSource;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private gfs: GeneralFunctionsService,
  ) {
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData() {
    this.data = new EntityService(this.httpClient, this.gfs);
    this.dataSource = new EntityDataSource(
      this.data,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter?.nativeElement.value;
      }
    );
  }

}
