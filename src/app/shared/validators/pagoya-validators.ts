import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^\d{8}$/.test(control.value) ? null : { dni: true };
  };
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^\d{9}$/.test(control.value) ? null : { phone: true };
  };
}

export function minAmountValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value === '') return null;
    return Number(control.value) >= min ? null : { minAmount: { min } };
  };
}
