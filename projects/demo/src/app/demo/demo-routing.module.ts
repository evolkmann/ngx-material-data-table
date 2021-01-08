import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoViewComponent } from './views/demo-view/demo-view.component';

const routes: Routes = [
  {
    path: '',
    component: DemoViewComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
