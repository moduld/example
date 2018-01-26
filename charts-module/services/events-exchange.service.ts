import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";
import {FiltersModelInterface, FooterIncomeValuesInterface } from '../interfaces/charts-interface';


@Injectable()
export class EventsExchangeService {

  headerFiltersApplied: BehaviorSubject<FiltersModelInterface> = new BehaviorSubject<FiltersModelInterface>(null);
  sendArrayOfLegendsToFooter: Subject<FooterIncomeValuesInterface[]> = new Subject<FooterIncomeValuesInterface[]>();
}
