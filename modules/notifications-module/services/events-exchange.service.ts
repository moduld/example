import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NotificationCreatedOrEditerServiceDataInterface } from '../../../interfaces';

@Injectable()
export class EventsExchangeService {

    openAddNotificationModal: Subject<null> = new Subject<null>();
    notificationCreatedOrEdited: Subject<NotificationCreatedOrEditerServiceDataInterface> =  new Subject<NotificationCreatedOrEditerServiceDataInterface>();

}
