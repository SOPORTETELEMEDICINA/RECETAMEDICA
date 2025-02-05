import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabContent, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {BasicListComponent} from "./basic/basic-list/basic-list.component";
import {DiagnosticsListComponent} from "./diagnostics/diagnostics-list/diagnostics-list.component";
import {PostalCodeListComponent} from "./postal-code/postal-code-list/postal-code-list.component";
import {EntityListComponent} from "./entity/entity-list/entity-list.component";
import {TownshipListComponent} from "./township/township-list/township-list.component";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-catalogs',
  standalone: true,
    imports: [
        BreadcrumbComponent,
        FormsModule,
        MatIcon,
        MatTab,
        MatTabGroup,
        MatTabLabel,
        BasicListComponent,
        MatTabContent,
        DiagnosticsListComponent,
        PostalCodeListComponent,
        EntityListComponent,
        TownshipListComponent,
        TopWidgetsComponent
    ],
  templateUrl: './catalogs.component.html',
  styleUrl: './catalogs.component.scss'
})
export class CatalogsComponent implements OnInit {
  ngOnInit() {
  }
}
