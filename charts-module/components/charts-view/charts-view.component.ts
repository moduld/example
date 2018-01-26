import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {EventsExchangeService} from '../../services/events-exchange.service';
import { DashboardService } from '../../../dashboard.service';
import {
  FiltersModelInterface,
  ChartsVievChartsDataInterface,
  ChartViewRequestsInterface,
  ChartViewSeriesInterface,
  ChartViewSeriesDataInterface,
  FooterIncomeValuesInterface } from '../../interfaces/charts-interface';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-charts-view',
  templateUrl: './charts-view.component.html',
  styleUrls: ['./charts-view.component.scss'],
  exportAs: 'chartsView'
})
export class ChartsViewComponent implements OnInit, OnDestroy {

  @Input() isMappedSide: boolean = false;
  horisontalChartsData: ChartViewRequestsInterface[] = [];
  excludedLegends: string[] = [];
  dataArchive: ChartViewRequestsInterface[];
  headersFiltersSubscription: Subscription;

  constructor (private dashboardService: DashboardService, private eventsExchangeService: EventsExchangeService) {}

  ngOnInit(): void {
    this.headersFiltersSubscription = this.eventsExchangeService.headerFiltersApplied
      .subscribe((data: FiltersModelInterface) => {
      if (data) {
        if (this.isMappedSide) {

        } else {
          this.getBarChartData(data);
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.headersFiltersSubscription && this.headersFiltersSubscription.unsubscribe();
  }

  filterDataByLegends(name: string): void {
    if (this.excludedLegends.indexOf(name) === -1) {
      this.excludedLegends.push(name);
    } else {
      this.excludedLegends.splice(this.excludedLegends.indexOf(name), 1);
    }
    this.handleRequestData();
  }

  private getBarChartData (filtersInfo: FiltersModelInterface): void {
    let requestBody: FiltersModelInterface = {
      widgettitle: filtersInfo.widgettitle,
      widgetshows: filtersInfo.widgetshows,
      businessid: filtersInfo.businessid,
      locationid: filtersInfo.locationid,
      requeststatusid: filtersInfo.requeststatusid,
      fromdate: filtersInfo.fromdate,
      todate: filtersInfo.todate,
    };

    this.dashboardService.getFilterredCharts(requestBody)
      .subscribe((res: ChartsVievChartsDataInterface) => {
      console.log(res);
      if (res && res.success === true) {
        this.dataArchive = res.chartdata.chartdatalist;
        this.excludedLegends = [];
        this.handleRequestData(true);
      } else {
        alert('UnAuthenticated');
      }
    }, err => {
      console.log(err)
    })
  }

  private handleRequestData(needSendDataToFooter?: boolean): void {
    let valuesArray: FooterIncomeValuesInterface[] = [];
    let namesArray: string[] = [];
    let iterableArchive = JSON.parse(JSON.stringify(this.dataArchive));
    iterableArchive.forEach((item: ChartViewRequestsInterface) => {
      item.maxValue = 0;
      item.requests.forEach((request: ChartViewSeriesInterface) => {
        request.series = request.series.filter((data: ChartViewSeriesDataInterface) => {
          if (this.excludedLegends.indexOf(data.name) !== -1) {
            request.total = (Number(request.total) - Number(data.value)).toString();
            return false;
          }
          data.color = this.setChartColor(data.name);
          if (namesArray.indexOf(data.name) === -1) {
            namesArray.push(data.name);
            valuesArray.push({color: data.color, name: data.name});
          }
          return true;
        });
        item.maxValue < Number(request.total) ? item.maxValue = Number(request.total) : '';
      })
    });

    if (needSendDataToFooter) {
      this.eventsExchangeService.sendArrayOfLegendsToFooter.next(valuesArray);
    }
    this.horisontalChartsData = iterableArchive;
  }

  private setChartColor(name: string): string {
    let color: string;
    if (name === 'Warranty Claim') {
      color = 'ffbe00'
    }
    if (name === 'Customer Returns ') {
      color = '96d3d8'
    }
    if (name === 'Sales and Policy Allowance') {
      color = 'ac60a8'
    }
    if (name === 'Write Offs') {
      color = 'f95644'
    }
    if (name === 'Scrap/Rework') {
      color = '27a5f9'
    }
    return color
  }
}
