import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../../../dashboard.service';
import {EventsExchangeService} from '../../services/events-exchange.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { HeaderSelectsFillDataInterface, FiltersModelInterface, TitlesDateInterface, HeaderSelectsResponseInterface } from '../../interfaces/charts-interface';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderBarComponent implements OnInit {

  @Input() title: string = '';
  @Input() isFiltersActivated: boolean = false;
  isFiltersShown: boolean = false;
  isDateSelectorActivated: boolean = false;
  businessData: HeaderSelectsFillDataInterface[] = [];
  regionsData: HeaderSelectsFillDataInterface[] = [];
  statusesData: HeaderSelectsFillDataInterface[] = [];
  filtersModelObject: FiltersModelInterface = {
    widgettitle: '',
    widgetshows: '',
    businessid: '',
    locationid: '',
    requeststatusid: '',
    fromdate: Moment().subtract(30, 'days').format('DD MMM YYYY').toLowerCase(),
    todate: Moment().format('DD MMM YYYY').toLowerCase(),
    appliedDateValue: '30days'
  };
  titleDates: TitlesDateInterface = {
    start: Moment(this.filtersModelObject.fromdate).format("DD/MM/YYYY"),
    end: Moment(this.filtersModelObject.todate).format("DD/MM/YYYY")
  };
  startDate: string = '';
  endDate: string = '';
  showError: boolean = false;

  constructor(private dashboardService: DashboardService, private eventsExchangeService: EventsExchangeService) {}

  ngOnInit() {
    this.eventsExchangeService.headerFiltersApplied.next(this.filtersModelObject);
    this.dashboardService.getFiltersBusiness()
      .subscribe(
        (data: HeaderSelectsResponseInterface) => {
          this.businessData = data.data;
        },
        (error: any) => {
          console.log(error)
        });

    this.dashboardService.getFiltersRegions()
      .subscribe(
        (data: HeaderSelectsResponseInterface) => {
          this.regionsData = data.data;
        },
        (error: any) => {
          console.log(error)
        });

    this.dashboardService.getFiltersStatuses()
      .subscribe(
        (data: HeaderSelectsResponseInterface) => {
          this.statusesData = data.data;
        },
        (error: any) => {
          console.log(error)
        });
  }

  customDatesChanged(value: string, type: string): void {
    if (value) {
      if (type === 'start') {
        this.filtersModelObject.fromdate = Moment(value).format('DD MMM YYYY').toLowerCase()
      } else {
        this.filtersModelObject.todate = Moment(value).format('DD MMM YYYY').toLowerCase()
      }
      if (this.filtersModelObject.fromdate && this.filtersModelObject.todate) {
        this.showError = !Moment(this.filtersModelObject.todate).isSameOrAfter(this.filtersModelObject.fromdate);
      }
    }
  }

  toggleFilterPanelState(state: boolean): void {
    this.isFiltersShown = state;
    this.isDateSelectorActivated = false;
  }

  toggleDateSelector(): void {
    this.isDateSelectorActivated = !this.isDateSelectorActivated;
    this.isFiltersShown = false;
  }

  timeRangeChanged(): void {
    this.showError = false;
    let currensState: string = this.filtersModelObject.appliedDateValue;
    let startDate: string;
    let endDate: string = Moment().format('DD MMM YYYY').toLowerCase();

    if (currensState === 'today') {
      startDate = endDate;
    }
    if (currensState === 'yesterday') {
      startDate = Moment().subtract(1, 'days').format('DD MMM YYYY').toLowerCase();
      endDate = startDate;
    }
    if (currensState === '7days') {
      startDate = Moment().subtract(7, 'days').format('DD MMM YYYY').toLowerCase();
    }
    if (currensState === '30days') {
      startDate = Moment().subtract(30, 'days').format('DD MMM YYYY').toLowerCase();
    }
    if (currensState === 'month') {
      startDate = Moment().startOf('month').format('DD MMM YYYY').toLowerCase();
    }
    if (currensState === 'year') {
      startDate = Moment().startOf('year').format('DD MMM YYYY').toLowerCase();
    }
    if (currensState === 'custom') {
      startDate = this.filtersModelObject.fromdate;
      endDate = this.filtersModelObject.todate;
    }

    this.filtersModelObject.fromdate = startDate;
    this.filtersModelObject.todate = endDate;
  }

  applyDateFilters(): void {
    if (this.filtersModelObject.fromdate && this.filtersModelObject.todate) {
      if (!this.showError) {
        this.eventsExchangeService.headerFiltersApplied.next(this.filtersModelObject);
        this.isFiltersShown = false;
        this.isDateSelectorActivated = false;
        this.titleDates = {
          start: Moment(this.filtersModelObject.fromdate).format("DD/MM/YYYY"),
          end: Moment(this.filtersModelObject.todate).format("DD/MM/YYYY")
        };
      }
    }
  }
}
