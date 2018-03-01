import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfigService } from '../../services';
import { EventsExchangeService, RequestService } from '../../services';

import {
  NotificationInterface,
  NotificationsTriggerCollectionInterface,
  NotificationsTriggerInterface,
  EditOrCreateNotificationInterface
} from '../../../../interfaces';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.scss']
})

export class EditNotificationComponent implements OnInit {

  title: string = this.translateService.translate('edit-notification.new_notification');
  editMode: boolean = false;
  notification: NotificationInterface = {
    uuid: '',
    application: {
      uuid: '',
      slug: '',
      name: '',
      logo: ''
    },
    headline: '',
    subline: '',
    actions: [
      {
        name: '',
        link: '',
        type: '',
        uuid: ''
      },
      {
        name: '',
        link: '',
        type: '',
        uuid: ''
      }
    ],
    recipients: [],
    trigger: {
      uuid: '',
      name: ''
    },
    reminder: '',
    enabled: true
  };
  editedNotificationArchive: string = '';
  applicationUuid: string = '';
  notificationUuid: string = '';
  triggers: NotificationsTriggerInterface[] = [];
  isLoaderActive: boolean = false;
  reminderValues: number[] = [1, 3, 7, 14, 21];
  @ViewChild('notificationForm') notificationForm: ElementRef;

  constructor(private routerModalService: RouterModalService,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private eventsExchange: EventsExchangeService,
              private translateService: TranslateService,
              private configService: ConfigService,
              private requestService: RequestService) {

    this.route.params.subscribe(params => {
      this.applicationUuid = params['app'] || '';
      this.notificationUuid = params['note'] || '';
    });

    this.editMode = !!this.notificationUuid;
    this.routerModalService.config({
      dialogClasses: 'pe-bootstrap modal-lg modal-lg-new modal-lg-auto-height',
      displayCloseIcon: true
    });
  }

  ngOnInit(): void {
    this.applicationUuid ? this.startComponent() : this.routerModalService.close();
  }

  submitForm(event: Event): void {
    event.preventDefault();
    if (JSON.stringify(this.notification) !== this.editedNotificationArchive) {
      const requestBody: EditOrCreateNotificationInterface = {
        app: this.applicationUuid,
        headline: this.notification.headline,
        subline: this.notification.subline,
        actions: [this.notification.actions[0]],
        recipients: Array.isArray(this.notification.recipients) ? this.notification.recipients : this.notification.recipients['split'](','),
        trigger: this.notification.trigger.uuid,
        reminder: this.notification.reminder,
        enabled: this.notification.enabled
      };
      if (this.notification.actions[1].type) {
        requestBody.actions.push(this.notification.actions[1]);
      }
      if (this.notificationUuid) {
        requestBody['uuid'] = this.notificationUuid;
      }
      this.isLoaderActive = true;
      let callServiceObservable = this.editMode ? this.requestService.editNotification(requestBody) : this.requestService.createNewNotification(requestBody);
      callServiceObservable
          .subscribe(
            (data: NotificationInterface) => {
              if (data) {
                this.eventsExchange.notificationCreatedOrEdited.next({flag: this.editMode, notification: data});
                this.routerModalService.close();
              } else {
                this.showNotification({
                  message: this.translateService.translate('edit-notification.wrong_data'),
                  icon: 'alert'
                });
              }
            },
            () => {
              this.isLoaderActive = false;
              this.showNotification({
                message: this.translateService.translate(this.editMode ? 'edit-notification.cant_save' : 'edit-notification.cant_create_new'),
                icon: 'alert'
              });
            });
    }
  }

  private startComponent(): void {
    this.requestService.getTriggers(this.applicationUuid)
      .subscribe(
        (data: NotificationsTriggerCollectionInterface) => {
          if (data && data['collection']) {
            this.triggers = data['collection'];
          } else {
            this.showNotification({
              message: this.translateService.translate('edit-notification.cant_get_triggers'),
              icon: 'alert'
            });
          }
        },
        () => {
          this.showNotification({
            message: this.translateService.translate('edit-notification.cant_get_triggers'),
            icon: 'alert'
          });
          this.routerModalService.close();
        });

    if (this.editMode) {
      this.title = this.translateService.translate('edit-notification.edit_notification');
      this.isLoaderActive = true;
      this.requestService.getOneNotification(this.notificationUuid)
        .subscribe(
          (data: NotificationInterface) => {
            if (data) {
              this.notification = this.prepareNotificationsData(data);
              this.editedNotificationArchive = JSON.stringify(data);
              this.isLoaderActive = false;
            } else {
              this.showNotification({
                message: this.translateService.translate('edit-notification.cant_get_notification'),
                icon: 'alert'
              });
            }
          },
          () => {
            this.showNotification({
              message: this.translateService.translate('edit-notification.cant_get_notification'),
              icon: 'alert'
            });
            this.routerModalService.close();
          });
    }
  }

  // @TODO if notification has only one action, we need to add one more to according a model
  // @TODO fix backend to get correct order of notifications. For now we have to use reverse
  private prepareNotificationsData(notification: NotificationInterface): NotificationInterface {
    if (!notification['actions'][1]) {
      notification['actions'].push({name: '', link: '', type: '', uuid: ''});
    }
    if (notification['recipients'].length === 2 && notification['recipients'][0] !== 'private') {
      notification['recipients'].reverse();
    }
    return notification;
  }

  private showNotification(uiNotificationSettings: NotificationConfig): void {
    this.notificationService.createNotification(this.configService.userUiNotificationSettings(uiNotificationSettings));
  }
}
