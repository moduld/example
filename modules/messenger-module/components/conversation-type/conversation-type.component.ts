import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd, Event as RouterEvent, Params} from '@angular/router';

import {
  StorageService,
  RequestService,
  EventsExchangeService,
  WebSocketService} from '../../services';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {
  UserInterface,
  ConversationsListInterface,
  NewMessageRequestInterface,
  MessagesInterface,
  ConversationInterface,
  SocketIncomeEventInterface
} from '../../../../interfaces';

@Component({
  selector: 'app-conversation-type',
  templateUrl: './conversation-type.component.html',
  styleUrls: ['./conversation-type.component.scss']
})

export class ConversationTypeComponent implements OnInit, OnDestroy {

  tipText: string = 'Select a contact or group';
  isTipShown: boolean = true;
  isLoaderActive: boolean = false;
  conversationslist: ConversationInterface[] = [];
  currentMessengerUser: UserInterface;
  currentMonolithUserSlug: string;
  currentConversationType: string;
  currentGroup: string;
  searchConversationValue: string = '';
  forwardToMessage: MessagesInterface;
  currentConversationUuid: string;
  private navigationEventEndObservable: Subject<null> = new Subject<null>();
  private routerEventsSubscription: Subscription;

  constructor(private router: Router,
              private storageService: StorageService,
              private requestService: RequestService,
              private eventsExchangeService: EventsExchangeService,
              private webSocketService: WebSocketService,
              private activatedRouteService: ActivatedRouteService,
              private activatedRoute: ActivatedRoute) {

    this.routerEventsSubscription = this.router.events
      .subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.onRouterNavigationEnd();
      }
    });
    this.activatedRoute.params
      .subscribe((params: Params) => {
      this.onActivatedRouteParamsChange(params);
    });
  }

  ngOnInit(): void {
    if (this.storageService.currentMonolithUser['business']) {
      this.currentMonolithUserSlug = this.storageService.currentMonolithUser['business'].slug;
    }
    this.eventsExchangeService.newConversationCreated
      .subscribe((newConversation: ConversationInterface) => {
        this.addNewConversationToList(newConversation);
      });
    this.eventsExchangeService.forwardToModeOn
      .subscribe((message: MessagesInterface) => {
        this.forwardToMessage = message;
        this.tipText = 'Select recipient of the message';
        this.isTipShown = true;
      });
    this.webSocketService.socketConnect()
      .subscribe((event: MessageEvent) => {
        console.log(JSON.parse(event.data))
        this.onNewIncomingSocketEvent(JSON.parse(event.data));
      })
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription.unsubscribe();
  }

  addNewConversationToList(newConversation: ConversationInterface): void {
    let isNotFounded: boolean = true;
    for (let i: number = 0; i < this.conversationslist.length; i++) {
      if (this.conversationslist[i].uuid === newConversation.uuid) {
        const subscription: Subscription = this.navigationEventEndObservable
          .subscribe(() => {
            this.router.navigate([{outlets: {chat_outlet: newConversation.uuid}}], {relativeTo: this.activatedRoute});
            subscription.unsubscribe();
          });
        isNotFounded = false;
        break;
      }
    }
    if (isNotFounded) {
      this.conversationslist.unshift(newConversation);
    }
  }

  onNewIncomingSocketEvent(incomeData: SocketIncomeEventInterface): void {
    if (incomeData.action === 'message-new') {
      if (incomeData.data.conversation !== this.currentConversationUuid) {
        for (let i: number = this.conversationslist.length; i--;) {
          if (this.conversationslist[i].uuid === incomeData.data.conversation) {
            this.conversationslist[i].new_messages_count++;
            break;
          }
        }
      }
    }
  }

  forwardTo(conversation: ConversationInterface): void {
    if (this.forwardToMessage) {
      const requestBody: NewMessageRequestInterface = {
        author: this.currentMessengerUser.uuid,
        conversation: conversation.uuid,
        message: this.forwardToMessage.uuid
      };
      this.requestService.forwardTo(requestBody)
        .subscribe(() => {
          this.forwardToMessage = null;
          this.isTipShown = false;
          this.tipText = 'Select a contact or group';
        });
    }
  }

  getModelChange($event: {event: MouseEvent}): void {
    this.searchConversationValue = $event.toString();
  }

  onRouterNavigationEnd(): void {
    this.isTipShown = true;
    this.currentConversationUuid = '';
    this.navigationEventEndObservable.next();
    if (this.activatedRoute.firstChild && this.activatedRoute.firstChild.outlet === 'chat_outlet') {
      this.isTipShown = false;
      this.currentConversationUuid = this.activatedRoute.firstChild.params['value']['uuid'];
      for (let i = this.conversationslist.length; i--;) {
        if (this.conversationslist[i].uuid === this.currentConversationUuid) {
          this.conversationslist[i].new_messages_count = 0;
          break;
        }
      }
    }
  }

  onActivatedRouteParamsChange(params: Params): void {
    this.currentConversationType = params['type'];
    this.currentGroup = this.activatedRouteService.getRouteParam(this.activatedRoute, 'group');
    this.currentMessengerUser = this.storageService.currentUser;
    this.isLoaderActive = true;
    this.conversationslist = [];
    const currentType: string = this.currentConversationType === 'user-account' ? 'private' : this.currentConversationType;
    const requestType: string = `${this.currentGroup}-${currentType}`;
    const requestUuid: string = this.currentMessengerUser.uuid;
    this.requestService.getConversationsList(requestType, requestUuid)
      .subscribe((list: ConversationsListInterface) => {
        console.log(list)
        this.isLoaderActive = false;
        this.conversationslist = list.collection;
      })
  }
}
