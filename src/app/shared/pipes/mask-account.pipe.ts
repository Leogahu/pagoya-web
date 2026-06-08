import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maskAccount' })
export class MaskAccountPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return `•••• ${value.slice(-4)}`;
  }
}
