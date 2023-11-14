import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any): any {
        if (value) {
            return `${value} kg`;
        }
        return value;
    }
}
