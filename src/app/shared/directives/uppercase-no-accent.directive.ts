import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercaseNoAccent]',
  standalone: true, // Esto permite usarla sin módulos
})
export class UppercaseNoAccentDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    input.value = this.transformToUppercaseWithoutAccents(input.value);
  }

  private transformToUppercaseWithoutAccents(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos y diacríticos
      .toUpperCase(); // Convertir a mayúsculas
  }
}
