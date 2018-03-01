import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';

import {RequestService} from './services';
import {routing} from './routing.module';
import {NestedComponent} from './components';
import {SharedModule} from './shared-module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    UiSearchResultsModule,
    SharedModule,
    ScrollEndDetectionModule
  ],
  declarations: [
    NestedComponent
  ],
  providers: [
    RequestService
  ]
})
export class LazyForMessengerModule {
}
