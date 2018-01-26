import {Component, OnInit, Input, ElementRef, HostBinding} from '@angular/core';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {

  @HostBinding('class.bordered') isBordered: boolean = false;
  @Input() progressValue: number = 0;
  @Input() progressColor: string = 'ffffff';
  @Input() transition: number = 0;
  @Input() stacked: boolean = true;
  @Input() height: number = 0;
  @Input() width: number = 0;
  @Input() bordered: boolean = false;

  @Input() position: string = 'horizontal';
  @Input() container: HTMLElement = null;

  constructor(private elRef: ElementRef) {
  }

  ngOnInit() {

    this.elRef.nativeElement.style.backgroundColor = '#' + this.progressColor;
    this.elRef.nativeElement.style.transition = this.transition + 's';

    if (this.position === 'horizontal') {
      this.elRef.nativeElement.style.width = 0;

      if (this.stacked) {
        this.elRef.nativeElement.style.float = 'left';
      }

      if (this.height) {
        this.elRef.nativeElement.style.height = this.height + 'px';
      } else {
        this.elRef.nativeElement.style.height = '100%';
      }

      let timeout: any = setTimeout(() => {
        this.elRef.nativeElement.style.width = this.progressValue + '%';
        clearTimeout(timeout);
      }, 0)
    }

    if (this.position === 'vertical') {
      if (this.container) {
        this.container.style.transform = 'rotateX(180deg)';
      }
      if (this.bordered) {
        this.isBordered = true;
      }
      this.elRef.nativeElement.style.height = 0;

      if (!this.stacked) {
        this.elRef.nativeElement.style.float = 'left';
      }

      if (this.width) {
        this.elRef.nativeElement.style.width = this.width + 'px';
      } else {
        this.elRef.nativeElement.style.width = '100%';
      }

      let timeout: any = setTimeout(() => {
        this.elRef.nativeElement.style.height = this.progressValue + '%';
        clearTimeout(timeout);
      }, 0)
    }
  }
}
