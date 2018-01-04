import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy {

    routerSubscription: any;

    constructor(private router: Router) {

        this.routerSubscription = this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {
                this.onUrlChange(this.router.url)
            }
        });


    }

    ngOnInit() {

    }

    ngOnDestroy() {

        this.routerSubscription && this.routerSubscription.unsubscribe()
    }

    onUrlChange(data: any): void {



    }

}
