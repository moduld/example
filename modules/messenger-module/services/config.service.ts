import { Injectable } from '@angular/core';
import * as settings from '../../../settings';
import { NotificationConfig } from '@pe/ui-kit/modules/ui-notification';
import { RestUrlInterface } from '../../../interfaces';

@Injectable()
export class ConfigService {

  get apiNotificationsRestUrlPrefix(): string {
    return settings.apiRestNotificationUrlPrefix;
  }

  get apiMessengerRestUrlPrefix(): string {
    return settings.apiRestMessengerUrlPrefix;
  }

  get apiUrls(): RestUrlInterface {
    return settings.apiUrls;
  }

  userUiNotificationSettings(uiNotificationSettings: NotificationConfig): NotificationConfig {
    const settings: NotificationConfig = {
      icon: uiNotificationSettings.icon,
      message: uiNotificationSettings.message,
      timeOut: 3000,
      position: 'top-right'
    };
    return settings;
  }
}
