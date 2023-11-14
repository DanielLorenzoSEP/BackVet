import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numbersOnly'
})
export class NumbersOnlyPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
  }
}
