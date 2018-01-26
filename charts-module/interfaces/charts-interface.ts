interface HeaderSelectsFillDataInterface {
  id: string;
  value: string;
}
interface CommonResponseInterface {
  message: string;
  success: boolean;
}
interface HeaderSelectsResponseInterface extends CommonResponseInterface {
  data: HeaderSelectsFillDataInterface[];
}
interface FiltersModelInterface {
  widgettitle?: string;
  widgetshows?: string;
  businessid: string;
  locationid: string;
  requeststatusid: string;
  fromdate: string;
  todate: string;
  appliedDateValue?: string;
}
interface TitlesDateInterface {
  start: string;
  end: string;
}


interface ChartViewSeriesDataInterface {
  name: string;
  value: string;
  color?: string;
}
interface ChartViewSeriesInterface {
  name: string;
  total: string;
  series: ChartViewSeriesDataInterface[];
}
interface ChartViewRequestsInterface {
  year: string;
  requests: ChartViewSeriesInterface[];
  maxValue?: number;
}
interface ChartsVievChartsDataListInterface {
  chartdatalist: ChartViewRequestsInterface[];
}
interface ChartsVievChartsDataInterface extends CommonResponseInterface {
  chartdata: ChartsVievChartsDataListInterface;
}


interface FooterIncomeValuesInterface {
  color: string;
  name: string;
}

export {
  HeaderSelectsFillDataInterface,
  HeaderSelectsResponseInterface,
  FiltersModelInterface,
  TitlesDateInterface,

  ChartViewSeriesDataInterface,
  ChartViewSeriesInterface,
  ChartViewRequestsInterface,
  ChartsVievChartsDataListInterface,
  ChartsVievChartsDataInterface,

  FooterIncomeValuesInterface
}
