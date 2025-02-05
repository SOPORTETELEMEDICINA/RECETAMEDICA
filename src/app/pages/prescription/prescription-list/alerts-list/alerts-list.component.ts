import {ChangeDetectionStrategy, Component, Inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatList, MatListModule} from "@angular/material/list";
import {MatExpansionModule} from '@angular/material/expansion';
import {CapitalizePipe} from "@core/pipes/capitalize.pipe";

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [
    MatDialogContent,
    MatIcon,
    MatIconButton,
    MatList,
    MatExpansionModule,
    CapitalizePipe,
    MatListModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alerts-list.component.html',
  styleUrl: './alerts-list.component.scss'
})
export class AlertsListComponent {
  readonly panelOpenState = signal(false);

  constructor(
    public dialogRef: MatDialogRef<AlertsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
}
