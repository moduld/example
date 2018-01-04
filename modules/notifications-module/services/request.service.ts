import { AuthTokenService } from '@pe/common/modules/common';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {
  ApplicationsAsideCollectionInterface,
  NotificationsTriggerCollectionInterface,
  NotificationCollectionInterface,
  NotificationInterface,
  EditOrCreateNotificationInterface,
  SwitchNotificationActiveStateInterface
} from '../../../interfaces';

@Injectable()
export class RequestService {

  constructor(private http: Http,
              private configService: ConfigService,
              private tokenService: AuthTokenService) {}

  getNotificationsAppsList(): Observable<ApplicationsAsideCollectionInterface> {
    const apiLink: string = this.configService.apiUrls['getNotificationsAppsList']();
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getNotificationsForCurrentApp(appUuid: string): Observable<NotificationCollectionInterface> {
    const apiLink: string = this.configService.apiUrls['getNotificationsForCurrentApp'](appUuid);
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getOneNotification(notificationUuid: string): Observable<NotificationInterface> {
    const apiLink: string = this.configService.apiUrls['getOneNotification'](notificationUuid);
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  createNewNotification(requestBody: EditOrCreateNotificationInterface): Observable<NotificationInterface> {
    const apiLink: string = this.configService.apiUrls['createNewNotification']();
    return this.http.post(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  editNotification(requestBody: EditOrCreateNotificationInterface): Observable<NotificationInterface> {
    const apiLink: string = this.configService.apiUrls['editNotification'](requestBody.uuid);
    return this.http.put(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  deleteNotification(notificationUuid: string): Observable<null> {
    const apiLink: string = this.configService.apiUrls['deleteNotification'](notificationUuid);
    return this.http.delete(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  changeNotificationState(requestBody: SwitchNotificationActiveStateInterface): Observable<NotificationInterface> {
    const apiLink: string = this.configService.apiUrls['changeNotificationState'](requestBody.uuid);
    return this.http.patch(apiLink, JSON.stringify(requestBody), this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  getTriggers(appUuid: string): Observable<NotificationsTriggerCollectionInterface> {
    const apiLink: string = this.configService.apiUrls['getTriggers'](appUuid);
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  private createRequestOptions(): RequestOptionsArgs {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', `Bearer ${this.tokenService.token}`);
    const options: RequestOptionsArgs = new RequestOptions({headers});
    return options;
  }
}
