import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthTokenService} from '@pe/common/modules/common';
import {StorageService} from './storage.service'

@Injectable()
export class WebSocketService {

  private messengerSubject: Subject<MessageEvent>;
  private connection: WebSocket;
  private webSocketUrl: string;
  private subscriberUuid: string;
  private token: string;
  private connectionsCounter: number = 0;

  constructor(private tokenService: AuthTokenService,
              private storageService: StorageService) {
  }

  socketConnect(): Subject<MessageEvent> {
    if (!this.connection) {
      this.webSocketUrl = this.storageService.currentUser.ws_url;
      this.subscriberUuid = this.storageService.currentUser.uuid;
      this.token = this.tokenService.token;
      this.messengerSubject = new Subject<MessageEvent>();
      this.connection = new WebSocket(this.webSocketUrl + '/');
      this.connection.onopen = () => {
        this.connection.send(`${this.token}:${this.subscriberUuid}`);
        this.connectionsCounter = 0;
      };
      this.connection.onclose = (event: CloseEvent) => {
        if (!event.wasClean && this.connectionsCounter < 5) {
          this.connection = null;
          this.connectionsCounter++;
          this.socketConnect();
        }
      };
      this.connection.onmessage = (event: MessageEvent) => {
        this.messengerSubject.next(event);
      };
    }

    return this.messengerSubject;
  }

  closeConnection(): void {
    this.connection.close();
    this.messengerSubject.complete();
  }
}

