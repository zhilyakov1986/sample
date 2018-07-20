import { NgModule } from '@angular/core';

import { SharedModule } from '../common/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';

import { CustomerBasicInfoComponent } from './customer-basic-info/customer-basic-info.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomersComponent } from './customer-list/customers.component';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';
import { CustomerSettingsComponent } from './customer-settings/customer-settings.component';

import { CustomerService } from './customer.service';
import { CustomerSourceService } from './customersource.service';
import { CustomerStatusService } from './customerstatus.service';
import { CustomerContactService } from './customercontact.service';

@NgModule({
  declarations: [
    CustomersComponent,
    CustomerHeaderComponent,
    CustomerDetailComponent,
    CustomerBasicInfoComponent,
    CustomerSettingsComponent,
  ],
  imports: [SharedModule, CustomerRoutingModule],
})
export class CustomerModule {
  static forRoot(): any {
    return {
      ngModule: CustomerModule,
      providers: [CustomerService, CustomerContactService, CustomerSourceService, CustomerStatusService],
    };
  }
}
