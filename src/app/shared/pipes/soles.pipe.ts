import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({ name: 'soles' })
export class SolesPipe implements PipeTransform {
  transform(value: number | null | undefined, symbol: string = 'S/'): string {
    const amount = value ?? 0;
    return `${symbol} ${formatNumber(amount, 'en-US', '1.2-2')}`;
  }
}
