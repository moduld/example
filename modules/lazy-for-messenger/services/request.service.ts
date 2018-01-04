import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response, RequestOptionsArgs} from '@angular/http';
import { AuthTokenService } from '@pe/user/src/modules/shared';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../../messenger-module/services';
import { ContactsListResponseInterface } from '../../interfaces/lazy-for-messenger.interface';

@Injectable()
export class RequestService {

  constructor(private http: Http,
              private configService: ConfigService,
              private tokenService: AuthTokenService) { }

  getContactsList(slug: string, page: string = '1', direction: string  = 'asc', sortingType: string  = 'firstName'): Observable<ContactsListResponseInterface> {
    const apiLink: string = this.configService.apiUrls['apiGetListUrl'](slug, page, direction, sortingType);
    return this.http.get(apiLink, this.createRequestOptions())
      .map((resp: Response) => resp.json())
      .catch((error: Response) => Observable.throw(error.json()));
  }

  private createRequestOptions(): RequestOptionsArgs {
    const headers: Headers = new Headers({'Content-Type': 'application/json'});
    headers.append('Authorization', `Bearer ${this.tokenService.getToken()}`);
    const options: RequestOptionsArgs = new RequestOptions({headers});
    return options;
  }
}
