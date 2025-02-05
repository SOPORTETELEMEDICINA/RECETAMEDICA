import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatMobile',
  standalone: true
})
export class FormatMobilePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    return digits.replace(/^(\d{3})(\d{3})(\d{4})(.*)$/, (_, p1, p2, p3, rest) =>
      `${p1}-${p2}-${p3}${rest ? '-' + rest : ''}`
    );
  }
}
