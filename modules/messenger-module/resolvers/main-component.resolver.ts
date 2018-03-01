import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Resolve, ActivatedRouteSnapshot} from '@angular/router';

import {UserInterface, CreateNewUserRequestBodyInterface, ResolverInterface} from '../../../interfaces';
import {RequestService} from '../services';

@Injectable()
export class MainComponentResolve implements Resolve<ResolverInterface> {

  private apiRestUrlPrefix: string;
  private businessSlug: string;

  constructor(private businessService: BusinessService,
              private profileService: ProfileService,
              private coreConfigService: CoreConfigService,
              private router: Router,
              private requestService: RequestService,
              private activatedRouteService: ActivatedRouteService) {

    this.apiRestUrlPrefix = this.coreConfigService.apiRestUrlPrefix;
  }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<ResolverInterface> {
    this.businessSlug = this.activatedRouteService.getRouteParam(activatedRouteSnapshot, 'slug');
    return this.createMessengerUser();
  }

  createMessengerUser(): Observable<ResolverInterface> {
    return Observable.create((observer: Observer<ResolverInterface>) =>  {
      if ( this.businessSlug ) {
        this.getCurrentBusinessInfo(this.businessSlug)
          .subscribe((business: BusinessInterface) => {
          this.makeCreationRequest(business, observer);
        })
      }
      else {
        this.getCurrentUserInfo()
          .subscribe((profile: ProfileInterface) => {
          this.makeCreationRequest(profile, observer);
        })
      }
    })
  }

  makeCreationRequest(currentMonolithUser: BusinessInterface | ProfileInterface, observer: Observer<ResolverInterface>): void {
    let requestBody: CreateNewUserRequestBodyInterface = {
      name: '',
      type: '',
      uuid: '',
      avatar: ''
    };
    let currentUserType: string;
    if (currentMonolithUser['business']) {
      currentUserType = 'business';
      requestBody = {
        name: currentMonolithUser['business']['name'],
        type: currentUserType,
        uuid: currentMonolithUser['business']['uuid']
      };
    } else {
      currentUserType = 'user-account';
      requestBody = {
        name: currentMonolithUser['email'],
        type: currentUserType,
        id: currentMonolithUser['id']
      };
    }

    this.requestService.createMessengerUser(requestBody)
      .subscribe((createdUser: UserInterface) => {
        observer.next(
          {
            messengerUser: createdUser,
            monolithUser: currentMonolithUser
          });
        observer.complete();
      });
  }

  getCurrentBusinessInfo(businessSlug: string): Observable<BusinessInterface> {
    return this.businessService.getBusiness(businessSlug, this.apiRestUrlPrefix)
      .map((business: BusinessInterface) => {
        return business;
      })
      .catch(() => {
        this.router.navigate(['/switcher']);
        return Observable.throw(null);
      });
  }

  getCurrentUserInfo(): Observable<ProfileInterface> {
    return this.profileService.getProfileSettings(this.apiRestUrlPrefix)
      .switchMap((profileSettings: ProfileSettingsInterface) => {
        return this.profileService.getProfile(profileSettings.id.toString(), this.apiRestUrlPrefix)
      })
      .map((userProfile: ProfileInterface) => {
        return userProfile;
      })
      .catch(() => {
        this.router.navigate(['/switcher']);
        return Observable.throw(null);
      });
  }
}
