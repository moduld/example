import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event } from '@angular/router';
import { StorageService, WebSocketService } from '../../services';
import {BusinessInterface } from '@pe/common/modules/business';
import {ProfileInterface} from '@pe/common/modules/profile';
import {UserInterface, ResolverInterface} from '../../../../interfaces';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})

export class ConversationComponent implements OnInit, OnDestroy {

    dashboardLink: string;
    thinkledAside: boolean = false;
    isUserBusiness: boolean = true;
    currentMonolithUser: BusinessInterface | ProfileInterface;
    currentMessengerUser: UserInterface;

    constructor(private router: Router,
                private storageService: StorageService,
                private webSocketService: WebSocketService,
                private activatedRoute: ActivatedRoute) {

        this.router.events
          .subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
              this.thinkledAside = this.router.url.indexOf('products_outlet:products') >= 0;
            }
        });

    }

    ngOnInit(): void {
      this.activatedRoute.data
        .subscribe((resolve: ResolverInterface) => {
        this.componentStartPoint(resolve);

      })
    }

    ngOnDestroy(): void {
      this.webSocketService.closeConnection();
    }

    componentStartPoint(resolve: ResolverInterface): void {
      this.currentMessengerUser = resolve['resolvedUsers']['messengerUser'];
      this.storageService.currentUser = resolve['resolvedUsers']['messengerUser'];
      this.currentMonolithUser = resolve['resolvedUsers']['monolithUser'];
      this.storageService.currentMonolithUser = resolve['resolvedUsers']['monolithUser'];
      if (this.currentMonolithUser['business']) {
        this.dashboardLink = `${this.router.url.substring(0, this.router.url.indexOf('/messenger'))}/home`;
        this.router.navigate(['./start'], {relativeTo: this.activatedRoute});
      } else {
        this.dashboardLink = `${this.router.url.substring(0, this.router.url.indexOf('/messenger'))}`;
        this.isUserBusiness = false;
        this.router.navigate(['./customer'], {relativeTo: this.activatedRoute});
      }
      this.webSocketService.socketConnect();
    }

    goToDashboard():void {
        this.router.navigateByUrl(this.dashboardLink)
    }
}
