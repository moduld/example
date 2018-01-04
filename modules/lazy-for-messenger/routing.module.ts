import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NestedComponent} from './components';

const routes: Routes = [
  {
    path: '',
    component: NestedComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
