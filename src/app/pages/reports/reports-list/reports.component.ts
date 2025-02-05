import {Component, OnInit} from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BreadcrumbComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  ngOnInit() {
  }
}
