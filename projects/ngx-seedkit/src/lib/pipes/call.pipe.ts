import { Pipe, PipeTransform } from '@angular/core';

const error_this = function () {
  throw new Error(`DON'T USE this INSIDE A FUNCTION CALLED BY | call OR | apply IT MUST BE A PURE FUNCTION!`);
};

@Pipe({
  name: 'call',
  pure: true,
  standalone: true,
})
export class CallPipe implements PipeTransform {
  transform<T = any, R = any>(value: T, args?: (param: T) => R): R {
    if (typeof args !== 'function') throw new TypeError('You must pass a PURE funciton to | call');
    return args?.call(
      new Proxy(
        {},
        {
          get: error_this,
          set: error_this,
          deleteProperty: error_this,
          has: error_this,
        },
      ),
      value,
    );
  }
}
