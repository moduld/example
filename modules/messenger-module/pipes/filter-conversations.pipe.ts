import { Pipe, PipeTransform } from '@angular/core';
import { ConversationInterface } from '../../../interfaces';

@Pipe({
  name: 'conversationsFilter'
})
export class FilterConversationsPipe implements PipeTransform {

  transform(conversationsList: ConversationInterface[], args?: string): ConversationInterface[] {
    let result: ConversationInterface[];

    if (!args) {
      console.log('1')
      result = conversationsList
    } else {
      console.log('2')
      result = conversationsList.filter((item: ConversationInterface) => {
        console.log(item)
        if (item.name) {
          return item.name.indexOf(args) >= 0
        } else {
          return item.participants[0].name.indexOf(args) >= 0
        }
      });
    }
    return result
  }
}
