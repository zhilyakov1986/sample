import { NgModule } from '@angular/core';

import { SharedModule } from '../common/shared.module';
import { CustomerLocationRoutingModule } from './customer-location-routing.module';

import { CustomerLocationsComponent } from './customer-location-list/customer-locations.component';

import { CustomerLocationBasicInfoComponent } from './customer-location-basic-info/customer-location-basic-info.component';
import { CustomerLocationDetailComponent } from './customer-location-detail/customer-location-detail.component';
import { CustomerLocationHeaderComponent } from './customer-location-header/customer-location-header.component';

import { CustomerLocationService } from './customerlocation.service';
import { CustomerService } from '../customers/customer.service';
import { ManageModule } from '../manage/manage.module';

@NgModule({
    declarations: [
        CustomerLocationHeaderComponent,
        CustomerLocationDetailComponent,
        CustomerLocationBasicInfoComponent,
        CustomerLocationsComponent,
    ],
    imports: [SharedModule, CustomerLocationRoutingModule, ManageModule],
})
export class CustomerLocationModule {
    static forRoot(): any {
        return {
            ngModule: CustomerLocationModule,
            providers: [CustomerLocationService, CustomerService],
        };
    }
}
