import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {fromEvent} from 'rxjs';
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter,} from '@shared';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {FeatherIconsComponent} from '@shared/components/feather-icons/feather-icons.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {GEMPService} from "@core/http/table-data-services/GEMP.service";
import {GEMP} from "@core/models/GEMP";
import {GroupsDataSource} from "@core/data-source/GroupsDataSource";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {GroupsCreateEditComponent} from "./groups-create-edit/groups-create-edit.component";

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    NgOptimizedImage,
  ],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss'
})
export class GroupsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'logo',
    'nombre',
    'actions'
  ];

  data?: GEMPService;
  dataSource!: GroupsDataSource;
  index?: number;
  idGEMP?: string;
  gemp?: GEMP;
  userImg?: string;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public gempService: GEMPService,
    private gfs: GeneralFunctionsService,
  ) {
    super();
  }

  ngOnInit() {
    this.userImg = 'assets/images/user/imgUSer.png';
    this.loadData();
  }

  refresh() {
    this.ngOnInit();
  }

  addNew() {

    const dialogRef = this.dialog.open(GroupsCreateEditComponent, {
      data: {
        entity: this.gemp,
        action: 'add',
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.data?.dataChange.value.unshift(
          this.gempService.getDialogData()
        );
        this.refresh();
        this.refreshTable();
        this.gfs.showNotification(
          'snackbar-success',
          'Entrada creada correctamente...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  editCall(row: GEMP) {
    this.idGEMP = row.idGEMP;

    const dialogRef = this.dialog.open(GroupsCreateEditComponent, {
      data: {
        entity: row,
        action: 'edit',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x) => x.idGEMP === this.idGEMP
        );
        if (foundIndex != null && this.data) {
          this.data.dataChange.value[foundIndex] =
            this.gempService.getDialogData();
          this.refresh();
          this.refreshTable();
          this.gfs.showNotification(
            'black',
            'Entrada editada correctamente...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  public loadData() {
    this.data = new GEMPService(this.httpClient, this.gfs);
    this.dataSource = new GroupsDataSource(
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

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        idGEMP: x.idGEMP,
        Nombre: x.nombre,
        LogoBase64: x.logoBase64,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}

