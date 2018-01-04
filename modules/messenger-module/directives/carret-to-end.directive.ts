import { Directive, ElementRef, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import {Subject} from'rxjs/Subject';

@Directive({
  selector: '[carretToEnd]'
})
export class CarretToEndDirective implements OnInit {

  @Input() actionSubscription: Subject<null>;

  constructor(@Inject( DOCUMENT ) private dom: Document,
              private element: ElementRef) { }

  ngOnInit(): void {
    this.actionSubscription.subscribe(() => {
      this.element.nativeElement.focus();
      let range: Range = this.dom.createRange();
      range.selectNodeContents(this.element.nativeElement);
      range.collapse(false);
      let selection: Selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    })
  }
}
