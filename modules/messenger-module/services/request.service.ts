import { AuthTokenService } from '@pe/common/modules/common';
import { ConfigService } from './config.service';
import { EventsExchangeService } from './events-exchange.service';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
  CreateNewUserRequestBodyInterface,
  UserInterface,
  ConversationsListInterface,
  MessagesFilterInterface,
  MessagesInterface,
  MessagesListInterface,
  ConversationInterface,
  CreateNewConversationRequestBodyInterface,
  NewMessageRequestInterface,
  WallpaperInterface,
  MessageReadStateRequestInterface
} from '../../../interfaces';

@Injectable()
export class RequestService {



  constructor(private http: Http,
              private configService: ConfigService,
              private eventsExchangeService: EventsExchangeService,
              private tokenService: AuthTokenService) {}

  createMessengerUser(requestBody: CreateNewUserRequestBodyInterface): Observable<UserInterface> {
    const apiLink: string = this.configService.apiUrls['getMessengerUser'](requestBody.uuid);
    return this.http.post(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getConversationsList(requestType: string, requestUuid: string): Observable<ConversationsListInterface> {
    const apiLink: string = this.configService.apiUrls['getConversationsList'](requestType, requestUuid);
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getMessagesListByConversationId(conversationUuid: string, userUuid: string, queryParams: MessagesFilterInterface): Observable<MessagesListInterface> {
    const queryString: string = `&f[timestamp]=${queryParams.timestamp}&f[direction]=${queryParams.direction}&f[limit]=${queryParams.limit}`;
    const apiLink: string = this.configService.apiUrls['getMessagesListByConversationId'](conversationUuid, userUuid, queryString);
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  createNewMessage(requestBody: NewMessageRequestInterface): Observable<MessagesInterface> {
    const apiLink: string = this.configService.apiUrls['createNewMessage']();
    return this.http.post(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  createNewConversation(requestBody: CreateNewConversationRequestBodyInterface): Observable<ConversationInterface> {
    const apiLink: string = this.configService.apiUrls['createNewConversation']();
    return this.http.post(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  deleteMessage(messageUuid: string): Observable<null> {
    const apiLink: string = this.configService.apiUrls['deleteMessage'](messageUuid);
    return this.http.delete(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  editMessage(messageUuid: string, messageText: string): Observable<MessagesInterface> {
    const apiLink: string = this.configService.apiUrls['editMessage'](messageUuid);
    return this.http.put(apiLink, JSON.stringify({body: messageText}), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  forwardTo(requestBody: NewMessageRequestInterface): Observable<MessagesInterface> {
    const apiLink: string = this.configService.apiUrls['forwardTo']();
    return this.http.post(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  messageReadState(requestBody: MessageReadStateRequestInterface): Observable<null> {
    const apiLink: string = this.configService.apiUrls['messageReadState']();
    return this.http.post(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  uploadFile(file: File, type: string): Observable<WallpaperInterface> {
    return Observable.create((observer: Observer<Response>) => {
      const formData: FormData = new FormData();
      formData.append('binary_content', file);
      formData.append('context', 'communications_message');
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.upload.onprogress = (event: ProgressEvent) => {
        const progress: number = Math.round(event.loaded / event.total * 100);
        this.eventsExchangeService.onProgressMediaEvent.next(progress);
      };
      xhr.open('POST', this.configService.apiUrls['uploadMessengerMedia'](type), true);
      xhr.setRequestHeader('Authorization', `Bearer ${this.tokenService.token}`);
      xhr.send(formData);
    });
  }

  private createRequestOptions(): RequestOptionsArgs {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', `Bearer ${this.tokenService.token}`);
    const options: RequestOptionsArgs = new RequestOptions({headers});
    return options;
  }
}
