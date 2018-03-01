import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { routing } from './routing.module';
import { FormsModule } from '@angular/forms';

import { MainComponent, AsideComponent, NotificationsSwitchComponent, EditNotificationComponent } from './components/index';
import { RequestService, EventsExchangeService, ConfigService } from './services';
import { DaysPipe, NotificationsFilterPipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    routing,
    RouterModalModule,
    FormsModule,
    UiNotificationModule,
    UiLayoutModule,
    HttpModule,
    I18nModule.provide(window['i18n_communication_notifications'])
  ],
  declarations: [
    MainComponent,
    AsideComponent,
    NotificationsSwitchComponent,
    EditNotificationComponent,
    DaysPipe,
    NotificationsFilterPipe
  ],
  providers: [
    RouterModalService,
    RequestService,
    EventsExchangeService,
    ConfigService
  ]
})
export class PENotificationBuilderModule { }
