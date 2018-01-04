import {Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params, Router, NavigationEnd, Event as RouterEvent, } from '@angular/router';
import { DOCUMENT } from "@angular/platform-browser";
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {
  RequestService,
  StorageService,
  WebSocketService,
  EventsExchangeService,
  MediaFilesService} from '../../services';

import {
  MessagesInterface,
  MessagesListInterface,
  UserInterface,
  ConversationInterface,
  NewMessageRequestInterface,
  MessagesFilterInterface,
  MediaFilesServiceOutput,
  MediaServerUploadSuccessInterface,
  SocketIncomeEventInterface,
  MessageReadStateRequestInterface
} from '../../../../interfaces';

@Component({
  selector: 'app-chate-body',
  templateUrl: './chate-body.component.html',
  styleUrls: ['./chate-body.component.scss']
})
export class ChateBodyComponent implements OnInit, OnDestroy {

  @ViewChild('chatWrapp') chatWrapp: ElementRef;
  @ViewChild('copyToClipboardTextArea') copyToClipboardArea: ElementRef;
  @ViewChild('contentEditableField') inputMessageField: ElementRef;
  @ViewChild('addFilesInput') addFilesInputRef: ElementRef;
  contentEditable: string = '';
  messages: MessagesInterface[];
  editedMessage: MessagesInterface = null;
  repliedMessage: MessagesInterface = null;
  previousScrollHeight: number;
  isLoaderActive: boolean = false;
  productsOutletStateEnabled: boolean = false;
  appsOutletStateEnabled: boolean = false;
  currentUser: UserInterface;
  currentConversationUuid: string;
  routerEventsSubscription: Subscription;
  messageFileUuid: string;
  uploadedFile: MediaFilesServiceOutput;
  webSocketServiceSubscription: Subscription;
  lastMessagesRequestTimeStamp: number = null;
  scrollEventsListens: boolean = true;
  moveCarretToEnd: Subject<null> = new Subject<null>();

  constructor(@Inject( DOCUMENT ) private dom: Document,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private requestService: RequestService,
              private webSocketService: WebSocketService,
              private mediaFilesService: MediaFilesService,
              private eventsExchangeService: EventsExchangeService,
              private storageService: StorageService) {

    this.routerEventsSubscription = this.router.events
      .subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.onUrlChange();
      }
    });

    this.activatedRoute.params
      .subscribe((params: Params) => {
      this.currentConversationUuid = params['uuid'];
      this.onParamsChange();
    });

    Observable.fromEvent(document, 'keypress')
      .filter((event: KeyboardEvent) => event.keyCode === 13 && !event.shiftKey)
      .subscribe((event: KeyboardEvent) => {
        event.preventDefault();
        this.sendMessage();
      })
  }

  ngOnInit(): void {
    this.previousScrollHeight = 0;
    this.webSocketServiceSubscription = this.webSocketService.socketConnect()
      .subscribe((event: MessageEvent) => {
        this.onIncomingEvent(JSON.parse(event.data));
      })
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription && this.routerEventsSubscription.unsubscribe();
    this.webSocketServiceSubscription.unsubscribe();
  }

  onIncomingEvent(incomeData: SocketIncomeEventInterface): void {
    if (incomeData.action === 'message-new' || incomeData.action === 'message-edit' || incomeData.action === 'message-delete') {
      if (incomeData['data']['conversation'] === this.currentConversationUuid && !incomeData['data']['mine']) {
        this.handleIncomingnewMessageEventData(incomeData.action, incomeData);
      }
    }

    if (incomeData.action === 'message-read') {
      for (let i: number = incomeData.data.messages.length; i--;) {
        const requiredFormat: SocketIncomeEventInterface = {
          action: incomeData.action,
          data: incomeData.data.messages[i]
        };
        this.handleIncomingnewMessageEventData('message-read', requiredFormat);
      }
    }
  }

  handleIncomingnewMessageEventData(action: string, incomeData: SocketIncomeEventInterface): void {
    if (action === 'message-new') {
      this.messages.push(incomeData.data);
      const requestBody: MessageReadStateRequestInterface = {
        user: this.currentUser.uuid,
        messages: [incomeData.data.uuid]
      };
      this.requestService.messageReadState(requestBody)
        .subscribe(() => {
        incomeData.data.read = true;
      });
      return;
    }
    for (let i: number = this.messages.length; i--;) {
      if (this.messages[i].uuid === incomeData.data.uuid) {
        action === 'message-edit' && this.messages.splice(i, 1, incomeData.data);
        action === 'message-delete' && this.messages.splice(i, 1);
        if (action === 'message-read') {
          this.messages[i].read = true;
        }
        break;
      }
    }
  }

  onUrlChange(): void {
    this.productsOutletStateEnabled = false;
    this.appsOutletStateEnabled = false;
    if (this.activatedRoute.children.length) {
      this.activatedRoute.children.forEach((item: ActivatedRoute) => {
        if (item.outlet === 'apps_outlet') {
          this.appsOutletStateEnabled = true;
        }
        if (item.outlet === 'products_outlet') {
          this.productsOutletStateEnabled = true;
        }
      })
    }
  }

  onParamsChange(calledByScroll?: boolean): void {
    if (calledByScroll && this.scrollEventsListens) {
      this.scrollEventsListens = false;
      this.getMessages(true);
    }
    if (!calledByScroll) {
      this.currentUser = this.storageService.currentUser;
      this.messages = [];
      this.isLoaderActive = true;
      this.scrollEventsListens = true;
      this.lastMessagesRequestTimeStamp = null;
      this.getMessages(false);
    }
  }

  getMessages(startByScrollEvent: boolean): void {
    const requestFilters: MessagesFilterInterface = {
      timestamp: this.lastMessagesRequestTimeStamp,
      direction: 'before',
      limit: 10
    };
    this.requestService.getMessagesListByConversationId(this.currentConversationUuid, this.currentUser.uuid, requestFilters)
      .subscribe((messages: MessagesListInterface) => {
      if (messages && messages.collection.length) {
        if (startByScrollEvent) {
          this.messages = messages.collection.concat(this.messages);
          this.scrollToBottom(true);
        } else {
          this.messages = messages.collection;
          this.scrollToBottom(false);
        }
        this.lastMessagesRequestTimeStamp = messages.collection[0].created_at;
        this.scrollEventsListens = true;
      }
        this.isLoaderActive = false;
      });
  }

  sendMessage(): void {
    if (this.contentEditable.trim() || this.messageFileUuid) {
      if (this.editedMessage) {
        this.requestService.editMessage(this.editedMessage.uuid, this.contentEditable)
          .subscribe((message: MessagesInterface) => {
          this.messages.splice(this.editedMessage['edited_index'], 1, message);
          this.editedMessage = null;
        })
      } else {
        const requestBody: NewMessageRequestInterface = {
          author: this.currentUser.uuid,
          conversation: this.currentConversationUuid
        };
        if (this.contentEditable) {
          requestBody['body'] = this.contentEditable;
        }
        if (this.repliedMessage) {
          requestBody['reply_to'] = this.repliedMessage.uuid;
        }
        if (this.messageFileUuid) {
          requestBody['media'] = [this.messageFileUuid];
        }
        this.requestService.createNewMessage(requestBody)
          .subscribe((message: MessagesInterface) => {
          this.messages.push(message);
          this.repliedMessage = null;
          this.messageFileUuid = null;
        })
      }
    }
    this.contentEditable = '';
    this.inputMessageField.nativeElement.innerHTML = '';
  }

  handleOnMessageAction(action: string, index: number): void {
    const message: MessagesInterface = this.messages[index];
    switch (action) {
      case 'delete': this.deleteMessage(message, index);
      break;
      case 'edit': this.editMessage(message, index);
      break;
      case 'reply': this.replyMessage(message);
      break;
      case 'forward': this.forwardTo(message);
      break;
      default: this.copyToClipboard(message);
      break;
    }
  }

  deleteMessage(message: MessagesInterface, index: number): void {
    this.requestService.deleteMessage(message.uuid).subscribe(() => {
      this.messages.splice(index, 1);
    })
  }

  editMessage(message: MessagesInterface, index: number): void {
    if (!this.repliedMessage) {
      message['edited_index'] = index;
      this.inputMessageField.nativeElement.innerHTML = message.body;
      this.editedMessage = message;
      this.moveCarretToEnd.next(null);
    }
  }

  replyMessage(message: MessagesInterface): void {
    if (!this.editedMessage) {
      this.repliedMessage = message;
    }
  }

  copyToClipboard(message: MessagesInterface): void {
    this.copyToClipboardArea.nativeElement.textContent = message.body;
    this.copyToClipboardArea.nativeElement.select();
    this.dom.execCommand( "Copy" );
  }

  forwardTo(message: MessagesInterface): void {
    this.eventsExchangeService.forwardToModeOn.next(message);
  }

  cancelLarkingBlockAction(): void {
    if (this.repliedMessage) {
      this.repliedMessage = null;
    }
  }

  compileToPlain(event: ClipboardEvent): void {
    if (event.clipboardData && event.clipboardData.getData) {
      event.preventDefault();
      const text: string = event.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    }
  }

  onFileChanged(event: Event): void {
    this.uploadedFile = this.mediaFilesService.validateFile(event);
    const progressSubscribtion: Subscription = this.eventsExchangeService.onProgressMediaEvent
      .subscribe((progress: number) => {
        this.uploadedFile.progress = progress;
    });
      this.requestService.uploadFile(this.uploadedFile.file, this.uploadedFile.type)
        .subscribe((response: MediaServerUploadSuccessInterface) => {
          progressSubscribtion.unsubscribe();
          this.messageFileUuid = response.uuid;
          this.uploadedFile = null;
          this.addFilesInputRef.nativeElement.value = '';
          this.sendMessage();
      })
  }

  scrollToBottom(holdPosiition: boolean): void {
    let timeout = setTimeout(() => {
      if (holdPosiition) {
        this.chatWrapp.nativeElement.scrollTop = this.chatWrapp.nativeElement.scrollHeight - this.previousScrollHeight;
      } else {
        this.chatWrapp.nativeElement.scrollTop = this.chatWrapp.nativeElement.scrollHeight - this.chatWrapp.nativeElement.clientHeight;
      }
      this.previousScrollHeight = this.chatWrapp.nativeElement.scrollHeight;
      clearTimeout(timeout);
    }, 0)
  }
}
