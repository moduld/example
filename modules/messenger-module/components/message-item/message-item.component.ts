import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MessagesInterface } from '../../../../interfaces';

@Component({
  selector: 'message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent {

  @Input() message: MessagesInterface;
  @Input() dropup: boolean;
  @Output() onActionClick = new EventEmitter<string>();

  clickHandle(event: Event): void {
    if (event.target['attributes']['data-action']) {
      this.onActionClick.emit(event.target['attributes']['data-action'].value);
    }
  }

  setMediaImageHeight(height: number): string {
    return height < 200 ? height + 'px' : 200 + 'px'
  }
}
