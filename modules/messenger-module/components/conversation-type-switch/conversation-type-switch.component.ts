import {Component, OnInit} from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Router
} from '@angular/router';

@Component({
  selector: 'app-conversation-type-switch',
  templateUrl: './conversation-type-switch.component.html',
  styleUrls: ['./conversation-type-switch.component.scss']
})
export class ConversationTypeSwitchComponent implements OnInit {

  isTipShown: boolean = true;
  currentType = 'user-account';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {

    this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          if (this.activatedRoute.firstChild) {
            this.currentType = this.activatedRoute.firstChild.params['value']['type'];
          }
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(() => {
        this.router.navigate([this.currentType], {relativeTo: this.activatedRoute});
      })
  }
}
