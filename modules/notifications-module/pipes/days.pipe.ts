import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'days'
})
export class DaysPipe implements PipeTransform {

  constructor() {}

  transform(value: number): string {
    return moment.duration(value, 'days').humanize();
  }
}
