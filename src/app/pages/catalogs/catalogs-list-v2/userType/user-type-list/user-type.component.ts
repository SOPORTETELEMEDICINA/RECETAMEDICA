import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {NgOptimizedImage} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FeatherIconsComponent} from "@shared/components/feather-icons/feather-icons.component";
import {MatRippleModule} from "@angular/material/core";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter} from "@shared";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {GeneralFunctionsService} from "@core/service/generalFunctions.service";
import {fromEvent} from "rxjs";
import {UserTypeService} from "@core/http/table-data-services/userType.service";
import {UserTypeDataSource} from "@core/data-source/UserTypeDataSource";
import {UserType} from "@core/models/UserType";
import {UserTypeCreateEditComponent} from "./user-type-create-edit/user-type-create-edit.component";

@Component({
  selector: 'app-user-type',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    NgOptimizedImage,
  ],
  templateUrl: './user-type.component.html',
  styleUrl: './user-type.component.scss'
})
export class UserTypeComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
    'nombre',
    'actions'
  ];

  data?: UserTypeService;
  dataSource!: UserTypeDataSource;
  index?: number;
  idTipoUsuario?: string;
  userType?: UserType;
  userImg?: string;
  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true})
  sort!: MatSort;
  @ViewChild('filter', {static: true}) filter?: ElementRef;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public userTypeService: UserTypeService,
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
    const dialogRef = this.dialog.open(UserTypeCreateEditComponent, {
      data: {
        entity: this.userType,
        action: 'add',
      }
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.data?.dataChange.value.unshift(
          this.userTypeService.getDialogData()
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

  editCall(row: UserType) {
    this.idTipoUsuario = row.idTipoUsuario;

    const dialogRef = this.dialog.open(UserTypeCreateEditComponent, {
      data: {
        entity: row,
        action: 'edit',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.data?.dataChange.value.findIndex(
          (x) => x.idTipoUsuario === this.idTipoUsuario
        );
        if (foundIndex != null && this.data) {
          this.data.dataChange.value[foundIndex] =
            this.userTypeService.getDialogData();
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
    this.data = new UserTypeService(this.httpClient, this.gfs);
    this.dataSource = new UserTypeDataSource(
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
        idTipoUsuario: x.idTipoUsuario,
        Nombre: x.nombre,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
