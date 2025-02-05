import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class GeneralFunctionsService {

  constructor(private snackBar: MatSnackBar) {
  }

  showErrorAlert(message: string, error: HttpErrorResponse): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      footer: error,
    }).then();
  }

  showAlert(text: string, title: string): void {
    Swal.fire({
      icon: 'success',
      title,
      text
    }).then();
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ): void {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  }

  mayusAcentos (obj: any): any {
    const excluirCampos = ["password", "usr", "email"];
    const nuevoObjeto: any = {};

    for (const clave in obj) {
      if (obj.hasOwnProperty(clave)) {
        if (typeof obj[clave] === 'string') {
          if (excluirCampos.includes(clave)) {
            nuevoObjeto[clave] = obj[clave];
          } else {
            nuevoObjeto[clave] = obj[clave]
              .toUpperCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
          }
        } else if (typeof obj[clave] === 'object' && obj[clave] !== null) {
          nuevoObjeto[clave] = this.mayusAcentos(obj[clave]);
        } else {
          nuevoObjeto[clave] = obj[clave];
        }
      }
    }
    return nuevoObjeto;
  }
}
