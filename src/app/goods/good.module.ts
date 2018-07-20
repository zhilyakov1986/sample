import { NgModule } from '@angular/core';

import { SharedModule } from '../common/shared.module';
import { GoodRoutingModule } from './good-routing.module';

import { GoodBasicInfoComponent } from './good-basic-info/good-basic-info.component';
import { GoodDetailComponent } from './good-detail/good-detail.component';
import { GoodsComponent } from './good-list/goods.component';
import { GoodHeaderComponent } from './good-header/good-header.component';

import { GoodService } from './good.service';
import { ServiceTypeService } from './servicetype.service';
import { ManageModule } from '../manage/manage.module';

@NgModule({
  declarations: [
    GoodsComponent,
    GoodHeaderComponent,
    GoodDetailComponent,
    GoodBasicInfoComponent,
  ],
  imports: [SharedModule, GoodRoutingModule, ManageModule],
})
export class GoodModule {
  static forRoot(): any {
    return {
      ngModule: GoodModule,
      providers: [GoodService, ServiceTypeService],
    };
  }
}
