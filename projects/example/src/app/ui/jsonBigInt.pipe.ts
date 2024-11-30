import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsonbi', pure: true, standalone: true })
export class JsonBigIntPipe implements PipeTransform {
  transform(value: any): string {
    return JSON.stringify(
      value,
      (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      },
      2,
    );
  }
}
