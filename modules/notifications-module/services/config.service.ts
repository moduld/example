import { Injectable } from '@angular/core';
import * as settings from '../../../settings';

import { RestUrlInterface } from '../../../interfaces';

@Injectable()
export class ConfigService {

  get apiRestUrlPrefix(): string {
    return settings.apiRestNotificationUrlPrefix;
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
