import { Pipe, PipeTransform } from '@angular/core';
import { NotificationInterface } from '../../../interfaces';

@Pipe({
  name: 'notificationFilter'
})

export class NotificationsFilterPipe implements PipeTransform {

  transform(notification: NotificationInterface[], filterReciever: string,
            filterTrigger: string, filterReminder: string, startWorkParam: number): NotificationInterface[] {
    const result: NotificationInterface[] = notification.filter((notification: NotificationInterface) => {
      let reciverState: boolean = true;
      let triggerState: boolean = true;
      let reminderState: boolean = true;

      if (filterReciever) {
        if (notification.recipients.length !== filterReciever.length) {
          reciverState = false;
        } else {
          for (let i: number = notification.recipients.length; i--;) {
            if (filterReciever.indexOf(notification.recipients[i]) < 0) {
              reciverState = false;
              break;
            }
          }
        }
      }

      if (filterTrigger) {
        triggerState = notification.trigger.uuid === filterTrigger;
      }

      if (filterReminder) {
        reminderState = notification.reminder === (Number(filterReminder) * 86400);
      }
      return reciverState && triggerState && reminderState;
    });
    return result;
  }
}
