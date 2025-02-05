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
import {UserType} from "@core/models/UserType";
import {UserTypeService} from "@core/http/table-data-services/userType.service";

@Component({
  selector: 'app-user-type-create-edit',
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
    MatDialogClose
  ],
  templateUrl: './user-type-create-edit.component.html',
  styleUrl: './user-type-create-edit.component.scss'
})
export class UserTypeCreateEditComponent {
  action: string;
  dialogTitle: string;
  userTypeForm: UntypedFormGroup;
  userType: UserType;
  formControl = new UntypedFormControl('', [
    Validators.required,
  ]);

  constructor(
    public dialogRef: MatDialogRef<UserTypeCreateEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<UserType>,
    public userTypeService: UserTypeService,
    private fb: UntypedFormBuilder,
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Editar: ' + data.entity.nombre;
      this.userType = data.entity;
    } else {
      this.dialogTitle = 'Nuevo Tipo de usuario';
      const blankObject = {} as UserType;
      this.userType = new UserType(blankObject);
      // this.userType = new GEMP();
    }
    this.userTypeForm = this.createContactForm();
  }

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Campo requerido'
      : 'Error';
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      idTipoUsuario: [this.userType.idTipoUsuario],
      nombre: [this.userType.nombre]
    });
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.action === 'edit'
      ? this.userTypeService.updateUserType(this.userTypeForm.getRawValue())
      : this.userTypeService.addUserType(this.userTypeForm.getRawValue());
  }

}
