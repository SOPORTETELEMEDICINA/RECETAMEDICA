import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BranchService } from '@core/http/branch.service';
import { Branch } from '@core/models/Branch';
import { DefaultResponse } from '@core/models/Http/DefaultResponse';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import {
  DatatableComponent,
  NgxDatatableModule,
  SortType,
} from '@swimlane/ngx-datatable';
import { BranchEditCreateComponent } from './branch-edit-create/branch-edit-create.component';
import { MatDialog } from '@angular/material/dialog';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { BusinessGroupService } from '@core/service/business-group.service';
import { CatalogsService } from '../../../core/http/catalogs.service';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatIconModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FeatherIconsComponent,
  ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss',
})
export class BranchListComponent implements OnInit {
  @ViewChild(DatatableComponent, { static: false })
  table!: DatatableComponent;

  SortType = SortType;
  register?: UntypedFormGroup;

  selectedRowData?: selectRowInterface;

  columns = [
    { prop: 'nombres', name: 'Nombre' },
    { prop: 'direcciones', name: 'Direccion' },
    { prop: 'responsables', name: 'Responsable' },
    { prop: 'correo_responsables', name: 'Correo Responsable' },
  ];

  data: Branch[] = [];
  filteredData: Branch[] = [];
  branches: Branch[] = [];

  businessGroupId: string | null = null;

  constructor(
    private branchService: BranchService,
    private dialogModel: MatDialog,
    private businessGroupService: BusinessGroupService,
    private catalogsService: CatalogsService
  ) {}

  ngOnInit(): void {
    this.businessGroupService.businessGroupId$.subscribe((id) => {
      this.businessGroupId = id;
      this.getBranchesByGemp(id!);
    });
  }

  openBranchModal() {
    this.dialogModel.open(BranchEditCreateComponent, {
      width: '640px',
      disableClose: true,
    });
  }

  filterDatatable(event: Event) {
    const val = (event.target as HTMLInputElement).value.toLowerCase();
    const colsAmt = this.columns.length;

    this.data = this.filteredData.filter(function (item: Branch) {
      for (let i = 0; i < colsAmt; i++) {
        if (item.nombre.toString().toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        }
      }
      return false;
    });
    this.table.offset = 0;
  }

  deleteRow(row: Branch) {
    this.data = this.arrayRemove(this.data, row.idSucursal);
  }

  arrayRemove(array: Branch[], id: string) {
    return array.filter(function (element: Branch) {
      return element.idSucursal != id;
    });
  }

  getBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (res: DefaultResponse<Branch[]>) => {
        this.branches = [...res.data];

        this.data = this.branches;
      },
    });
  }

  getBranchesByGemp(idGEMP: string) {
    this.catalogsService.getBranchesByIdGEMP(idGEMP).subscribe({
      next: (res: Branch[]) => {
        this.data = [...res];
      },
    });
  }
}

export interface selectRowInterface {
  img: string;
  firstName: string;
  lastName: string;
}
