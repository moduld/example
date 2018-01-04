import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'lastMessage'
})
export class DaysPipe implements PipeTransform {

  transform(value: number): string {
    if (moment(moment.now()).isSame(moment.unix(value), 'day')) {
      return moment.unix(value).format('HH:mm');
    } else {
      return moment.unix(value).format('D MMM');
    }
  }
}
