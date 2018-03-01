import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent, NotificationsSwitchComponent, EditNotificationComponent, AsideComponent } from './components';

const routes: Routes = [
    { path: 'main',
      component: MainComponent,
      children: [
        { path: ':state',
          component: AsideComponent,
          children: [
            { path: ':app',
              component: NotificationsSwitchComponent,
              children: [
                { path: 'edit',
                  component: ModalComponent,
                  outlet: 'modal',
                  children: [
                    {
                      path: 'view',
                      component: EditNotificationComponent
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    { path: '**', redirectTo: 'main/notifications'}
    ];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
