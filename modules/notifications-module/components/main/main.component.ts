import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventsExchangeService } from '../../services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {

  dashboardLink: string;

  constructor(private eventsExchange: EventsExchangeService,
              private router: Router) {

    this.dashboardLink = `${this.router.url.substring(0, this.router.url.indexOf('/notifications'))}/home`;
  }

  goToDashboard(): void {
    this.router.navigateByUrl(this.dashboardLink);
  }

  openAddModal(): void {
    this.eventsExchange.openAddNotificationModal.next();
  }
}
