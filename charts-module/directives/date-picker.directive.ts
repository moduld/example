import { Directive, ElementRef, EventEmitter, Output, Input } from '@angular/core';
declare var $:JQueryStatic;
import * as Moment from 'moment';

@Directive({
  selector: '[appDatePicker]'
})
export class DatePickerDirective {

  @Output() inputValueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() initialValue: string;
  settings: any = {
    defaultDateFormat: 'dd/mm/yyyy',
    displayFormat: "ymd",
    monthFormat: "short",
    dropdownClass: "columns form-control form-control-modify",
    monthSuffixes: false,
    daySuffixes: false
  };

  constructor(private elementRef: ElementRef) {

    let timeout: any = setTimeout(() => {
      this.settings['defaultDate'] = Moment(this.initialValue).format('DD/MM/YYYY');
      $(this.elementRef.nativeElement)['dateDropdowns'](this.settings)
        .on('change', (event) => {
          this.inputValueChanged.emit(event.target.value);
        });
      clearTimeout(timeout);
    }, 0)
  }
}
