import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversationComponent } from './components/conversation/conversation.component';
import { StartComponent } from './components/start/start.component';
import { ConversationTypeSwitchComponent } from './components/conversation-type-switch/conversation-type-switch.component';
import { ConversationTypeComponent } from './components/conversation-type/conversation-type.component';
import { ChateBodyComponent } from './components/chate-body/chate-body.component';
import { ProductsComponent } from './components/products/products.component';
import { AppsBarComponent } from './components/apps-bar/apps-bar.component';
import { AddEmployeeModalComponent } from './components/add-employee-modal/add-employee-modal.component';
import { MainComponentResolve } from './resolvers';

const routes: Routes = [
    { path: '',
      component: ConversationComponent,
      resolve: {
        resolvedUsers: MainComponentResolve
      },
      children: [
        { path: 'start',
          component: StartComponent },
        { path: ':group',
          component: ConversationTypeSwitchComponent,
          children : [
            { path: ':type',
              component: ConversationTypeComponent,
              children: [
              { path: ':uuid',
                component: ChateBodyComponent,
                children: [
                { path: 'products',
                component: ProductsComponent,
                outlet: 'products_outlet'},
                { path: 'apps',
                  component: AppsBarComponent,
                  outlet: 'apps_outlet'}
              ],
                outlet: 'chat_outlet'},

              { path: 'contacts/:group/:type/:slug',
                component: AddEmployeeModalComponent,
                loadChildren: '../lazy-for-messenger#LazyForMessengerModule',
                outlet: 'contacts_outlet'}
            ]},
        ]},
      ]},

    { path: '**', redirectTo: '/start' }
    ];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
