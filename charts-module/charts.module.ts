import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from "ngx-tooltip";
import {
  ProgressbarComponent,
  HeaderBarComponent,
  FooterBarComponent,
  ChartsViewComponent,
  CommonComponent } from './components';
import { DatePickerDirective } from './directives/date-picker.directive';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule
  ],
  declarations: [
    ProgressbarComponent,
    HeaderBarComponent,
    FooterBarComponent,
    ChartsViewComponent,
    DatePickerDirective,
    CommonComponent
  ],
  providers: [
  ],
  exports: [
    CommonComponent
  ]
})

export class ChartsModule { }
