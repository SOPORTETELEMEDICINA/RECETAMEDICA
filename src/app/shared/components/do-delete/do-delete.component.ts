import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

export interface DialogData {
  toDelete: string,
  id: string | number;
  name: string;
  actionService: (id: string | number) => void;
}

@Component({
  selector: 'app-do-delete',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './do-delete.component.html',
  styleUrl: './do-delete.component.scss'
})
export class DoDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<DoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.data.actionService(this.data.id);
    this.dialogRef.close(1);
  }
}
