/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import Swal from "sweetalert2";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  imports: [MatButtonModule, NgIf],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() acceptedTypes: string = '';

  onChange!: Function;
  public file: File | null = null;

  constructor(private host: ElementRef<HTMLInputElement>) {
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    if (file) {
      if (!this.isAcceptedType(file)) {
        Swal.fire({
          title: 'Archivo no permitido',
          text: `Solo se permiten archivos del tipo: ${this.acceptedTypes}`,
          icon: 'error',
          confirmButtonText: 'Entendido',
        }).then();
        return;
      }
      this.convertFileToBase64(file).then(base64 => {
        this.onChange(base64);
      });
      this.file = file;
    }
  }

  clearFile(): void {
    this.file = null;
    this.onChange(null);
  }

  writeValue(value: string | null): void {
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private isAcceptedType(file: File): boolean {
    if (!this.acceptedTypes) {
      return true;
    }
    const acceptedTypes = this.acceptedTypes.split(',').map(type => type.trim());
    return acceptedTypes.some(type => file.type.match(type));
  }
}
