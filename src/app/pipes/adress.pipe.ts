import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adress'
})
export class AdressPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
