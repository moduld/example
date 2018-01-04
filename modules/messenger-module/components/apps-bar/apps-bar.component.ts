import { Component, AfterViewInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-apps-bar',
  templateUrl: './apps-bar.component.html',
  styleUrls: ['./apps-bar.component.scss']
})

export class AppsBarComponent implements AfterViewInit {

  showApps: boolean = false;
  constructor() { }

  ngAfterViewInit(): void {
    this.showApps = true;
  }
}
