import {Component} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatTab, MatTabContent, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {GroupsComponent} from "./groups/groups-list/groups.component";
import {UserTypeComponent} from "./userType/user-type-list/user-type.component";
import {TopWidgetsComponent} from "@shared/components/top-widgets/top-widgets.component";

@Component({
  selector: 'app-catalogs-list-v2',
  standalone: true,
    imports: [
        BreadcrumbComponent,
        FormsModule,
        MatIcon,
        MatTab,
        MatTabGroup,
        MatTabLabel,
        GroupsComponent,
        UserTypeComponent,
        MatTabContent,
        TopWidgetsComponent
    ],
  templateUrl: './catalogs-v2.component.html',
  styleUrl: './catalogs-v2.component.scss'
})
export class CatalogsV2Component {

}
