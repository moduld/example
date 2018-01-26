import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import {EventsExchangeService} from '../../services/events-exchange.service';
import {FooterIncomeValuesInterface } from '../../interfaces/charts-interface';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit, OnDestroy {

  @Output() toggleTimeLIneVisibility: EventEmitter<string> = new EventEmitter<string>();
  legends: FooterIncomeValuesInterface[] = [];
  legendsArraySuscription: Subscription;

  constructor(private eventsExchangeService: EventsExchangeService) {}

  ngOnInit(): void {
    this.legendsArraySuscription = this.eventsExchangeService.sendArrayOfLegendsToFooter
      .subscribe((data: FooterIncomeValuesInterface[]) => {
      if (data) {
        this.legends = data;
        console.log(this.legends)
      }
    })
  }

  ngOnDestroy(): void {
    this.legendsArraySuscription && this.legendsArraySuscription.unsubscribe();
  }

  toggleLegendVisibility(name: string): void {
    this.toggleTimeLIneVisibility.emit(name);
  }
}
