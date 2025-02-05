import {Component, Inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {DialogData} from "@core/interfaces/dialog-data";
import {GEMPService} from "@core/http/table-data-services/GEMP.service";
import {GEMP} from "@core/models/GEMP";
import {FileUploadComponent} from "@shared/components/file-upload/file-upload.component";

@Component({
  selector: 'app-groups-create-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
    FileUploadComponent
  ],
  templateUrl: './groups-create-edit.component.html',
  styleUrl: './groups-create-edit.component.scss'
})
export class GroupsCreateEditComponent {
  action: string;
  dialogTitle: string;
  groupsForm: UntypedFormGroup;
  gemp: GEMP;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  constructor(
    public dialogRef: MatDialogRef<GroupsCreateEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<GEMP>,
    public groupsService: GEMPService,
    private fb: UntypedFormBuilder,
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Editar: ' + data.entity.nombre;
      this.gemp = data.entity;
    } else {
      this.dialogTitle = 'Nuevo Grupo Empresarial';
      const blankObject = {} as GEMP;
      this.gemp = new GEMP(blankObject);
      // this.gemp = new GEMP();
    }
    this.groupsForm = this.createContactForm();
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : 'Error';
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      nombre: [this.gemp.nombre],
      idGEMP: [this.gemp.idGEMP],
      logoBase64: [this.gemp.logoBase64],
    });
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.action === 'edit'
      ? this.groupsService.updateGEMP(this.groupsForm.getRawValue())
      : this.groupsService.addGEMP(this.groupsForm.getRawValue());
  }

}
