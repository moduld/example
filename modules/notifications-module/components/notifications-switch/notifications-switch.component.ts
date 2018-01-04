import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services';
import { NotificationService, NotificationConfig } from '@pe/ui-kit/modules/ui-notification';
import { RequestService, EventsExchangeService } from '../../services';
import { TranslateService } from '@pe/common/modules/i18n';
import {
  NotificationInterface,
  NotificationsTriggerCollectionInterface,
  NotificationCollectionInterface,
  NotificationsTriggerInterface,
  SwitchNotificationActiveStateInterface,
  NotificationCreatedOrEditerServiceDataInterface
} from '../../../../interfaces';

@Component({
  selector: 'app-notifications-switch',
  templateUrl: './notifications-switch.component.html',
  styleUrls: ['./notifications-switch.component.scss']
})
export class NotificationsSwitchComponent implements OnInit {

  applicationUuid: string;
  notifications: NotificationInterface[] = [];
  triggers: NotificationsTriggerInterface[] = [];
  filterReciever: string = '';
  filterTrigger: string = '';
  filterReminder: string = '';
  isLoaderActive: boolean = false;
  startPipeWorkParam: number = 0;
  reminderValues: number[] = [1, 3, 7, 14, 21];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private requestService: RequestService,
              private configService: ConfigService,
              private translateService: TranslateService,
              private eventsExchange: EventsExchangeService,
              private notificationService: NotificationService) {

    this.route.params.subscribe((params: Params) => {
      this.applicationUuid = params['app'];
      this.getNotificationsData();
    });
  }

  ngOnInit(): void {
    this.eventsExchange.notificationCreatedOrEdited
      .subscribe(
        (data: NotificationCreatedOrEditerServiceDataInterface) => {
          this.addNotificationToList(data);
        });

    this.eventsExchange.openAddNotificationModal
      .subscribe(() => {
        if (this.applicationUuid) {
          this.router.navigate([this.router.url, {outlets: {modal: ['edit', 'view', {app: this.applicationUuid}]}}] );
        }
      });
  }

  switchNotificationState(notification: NotificationInterface): void {
    const previusValue: boolean = notification.enabled;
    notification.enabled = !notification.enabled;
    const requestBody: SwitchNotificationActiveStateInterface = JSON.parse(JSON.stringify(notification));
    notification.disabled = true;
    requestBody.trigger = notification.trigger.uuid;

    this.requestService.changeNotificationState(requestBody)
      .subscribe(
        () => {
          notification.disabled = false;
          this.showNotification({message: this.translateService.translate('notifications-switch.state_changed'), icon: 'checkmark'});
        },
        () => {
          notification.enabled = previusValue;
          notification.disabled = false;
          this.showNotification({message: this.translateService.translate('notifications-switch.cant_change_state'), icon: 'alert'});
        });
  }

  notificationDelete(event: Event, notification: NotificationInterface, index: number): void {
    event.preventDefault();
    this.requestService.deleteNotification(notification.uuid).subscribe(
      () => {
        this.notifications.splice(index, 1);
        this.showNotification({message: this.translateService.translate('notifications-switch.notification_deleted'), icon: 'checkmark'});
        this.startPipeWorkParam++;
      },
      () => {
        this.showNotification({message: this.translateService.translate('notifications-switch.deleting_error'), icon: 'alert'});
      });
  }

  private getNotificationsData(): void {
    this.isLoaderActive = true;
    this.notifications = [];
    this.requestService.getNotificationsForCurrentApp(this.applicationUuid)
      .subscribe(
        (data: NotificationCollectionInterface) => {
          if (data) {
            this.notifications = data['collection'];
            this.isLoaderActive = false;
          }
        },
        () => {
          this.isLoaderActive = false;
          this.showNotification({message: this.translateService.translate('notifications-switch.cant_get_notifications'), icon: 'alert'});
        });

    this.requestService.getTriggers(this.applicationUuid)
      .subscribe(
        (data: NotificationsTriggerCollectionInterface) => {
          if (data) {
            this.triggers = data['collection'];
          }
        },
        () => {
          this.triggers = [];
          this.showNotification({message: this.translateService.translate('notifications-switch.cant_get_triggers'), icon: 'alert'});
        });
  }

  private addNotificationToList(data: NotificationCreatedOrEditerServiceDataInterface): void {
    const userMessage: string = data.flag ? this.translateService.translate('notifications-switch.notification_changed') :
      this.translateService.translate('notifications-switch.notification_added');
    this.showNotification({message: userMessage, icon: 'checkmark'});
    if (data.flag) {
      for (let i: number = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].uuid === data.notification.uuid) {
          this.notifications.splice(i, 1, data.notification);
          break;
        }
      }
    } else {
      this.notifications.unshift(data.notification);
    }
    this.startPipeWorkParam++;
  }

  private showNotification(uiNotificationSettings: NotificationConfig): void {
    this.notificationService.createNotification(this.configService.userUiNotificationSettings(uiNotificationSettings));
  }
}
