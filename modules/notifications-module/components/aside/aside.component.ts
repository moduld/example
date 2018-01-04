import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services';
import { NotificationService, NotificationConfig } from '@pe/ui-kit/modules/ui-notification';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services';
import { TranslateService } from '@pe/common/modules/i18n';
import { LoaderManagerService } from '@pe/common/modules/common';
import 'rxjs/add/operator/filter';
import {
  ApplicationsAsideInterface,
  ApplicationsAsideCollectionInterface
} from '../../../../interfaces';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {

  currentState: string;
  applications: ApplicationsAsideInterface[] = [];
  isLoaderActive: boolean = false;
  haveActiveApp: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private translateService: TranslateService,
              private loaderManagerService: LoaderManagerService,
              private configService: ConfigService,
              private requestService: RequestService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentState = this.activatedRoute.snapshot.params['state'];
        this.haveActiveApp = !this.activatedRoute.firstChild;
      }
    });
  }

  ngOnInit(): void {
    this.getAppsList();
  }

  private getAppsList(): void {
    this.isLoaderActive = true;
    this.requestService.getNotificationsAppsList()
      .subscribe(
        (data: ApplicationsAsideCollectionInterface) => {
          if (data) {
            this.applications = data['collection'];
            this.isLoaderActive = false;
            this.loaderManagerService.showAppLoader(false);
          }
        },
        () => {
          this.isLoaderActive = false;
          this.loaderManagerService.showAppLoader(false);
          this.showNotification({
            message: this.translateService.translate('aside.applications_error'),
            icon: 'alert'
          });
        });
  }

  private showNotification(uiNotificationSettings: NotificationConfig): void {
    this.notificationService.createNotification(this.configService.userUiNotificationSettings(uiNotificationSettings));
  }
}
