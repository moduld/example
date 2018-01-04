import { NgModule, ModuleWithProviders } from '@angular/core';
import { EventsExchangeService } from './services/events-exchange.service';

@NgModule({})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [EventsExchangeService]
    };
  }
}
