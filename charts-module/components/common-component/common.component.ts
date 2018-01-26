import { Component, OnInit, Input } from '@angular/core';
import { EventsExchangeService } from '../../services/events-exchange.service';

@Component({
  selector: 'app-common-component',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
  providers: [EventsExchangeService]
})
export class CommonComponent implements OnInit {

  @Input() title: string = "";
  @Input() isFiltersActivated: boolean = true;
  @Input() isMappedSide: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
