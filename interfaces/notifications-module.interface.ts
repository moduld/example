interface ApplicationsAsideInterface {
  uuid: string;
  slug: string;
  name: string;
  logo: string;
}

interface ApplicationsAsideCollectionInterface {
  collection: ApplicationsAsideInterface[];
}

interface NotificationsTriggerInterface {
  uuid: string;
  name: string;
}

interface NotificationsTriggerCollectionInterface {
  collection: NotificationsTriggerInterface[];
}

interface NotificationButtonActionInterface {
  type: string;
  name: string;
  link: string;
  uuid: string;
}

interface NotificationInterface {
  uuid: string;
  application: ApplicationsAsideInterface;
  headline: string;
  subline: string;
  actions: NotificationButtonActionInterface[];
  recipients: string[];
  trigger: NotificationsTriggerInterface;
  reminder: number | string;
  enabled: boolean;
  disabled?: boolean;
}

interface SwitchNotificationActiveStateInterface {
  uuid: string;
  application: ApplicationsAsideInterface;
  headline: string;
  subline: string;
  actions: NotificationButtonActionInterface[];
  recipients: string[];
  trigger: string;
  reminder: number;
  enabled: boolean;
  disabled?: boolean;
}

interface NotificationCollectionInterface {
  collection: NotificationInterface[];
}

interface NotificationCreatedOrEditerServiceDataInterface {
  flag: boolean;
  notification: NotificationInterface;
}

interface EditOrCreateNotificationInterface {
  uuid?: string;
  app: string;
  headline: string;
  subline: string;
  actions: NotificationButtonActionInterface[];
  recipients: string[];
  trigger: string;
  reminder: number | string;
  enabled: boolean;
}

interface RestUrlInterface {
  [propName: string]: (param1?: string, param2?: string, param3?: string, param4?: string) => string;
}

export {
  ApplicationsAsideInterface,
  ApplicationsAsideCollectionInterface,
  NotificationsTriggerInterface,
  NotificationsTriggerCollectionInterface,
  NotificationButtonActionInterface,
  NotificationInterface,
  NotificationCollectionInterface,
  SwitchNotificationActiveStateInterface,
  NotificationCreatedOrEditerServiceDataInterface,
  EditOrCreateNotificationInterface,
  RestUrlInterface
};
