import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {ContactsListResponseInterface, PaginationDataInterface, ContactsModel} from '../../../interfaces/lazy-for-messenger.interface';

@Injectable()
export class EventsExchangeService {

  selectedContactsSent: Subject<ContactsModel[]> = new Subject<ContactsModel[]>();
}
