import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ConversationInterface, MessagesInterface } from '../../../interfaces';

@Injectable()
export class EventsExchangeService {

    newConversationCreated: Subject<ConversationInterface> = new Subject<ConversationInterface>();
    forwardToModeOn: Subject<MessagesInterface> = new Subject<MessagesInterface>();
    onProgressMediaEvent: Subject<number> = new Subject<number>();
}
