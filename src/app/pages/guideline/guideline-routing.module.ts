import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuidelinePage } from './guideline.page';

const routes: Routes = [
  {
    path: '',
    component: GuidelinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidelinePageRoutingModule {}
