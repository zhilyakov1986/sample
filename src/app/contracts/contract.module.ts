import { NgModule } from '@angular/core';

import { SharedModule } from '../common/shared.module';
import { ContractRoutingModule } from './contract-routing.module';

import { ContractBasicInfoComponent } from './contract-basic-info/contract-basic-info.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractsComponent } from './contract-list/contracts.component';
import { ContractHeaderComponent } from './contract-header/contract-header.component';

import { ContractService } from './contract.service';

import { CustomerModule } from '../customers/customer.module';
import { ContractStatusService } from './contractstatus.service';
import { UserModule } from '../users/user.module';
import { LocationServiceModule } from '../location-services/location-service.module';
import { LocationServicesComponent } from '../location-services/location-service-list/location-services.component';

@NgModule({
    declarations: [
        ContractsComponent,
        ContractHeaderComponent,
        ContractDetailComponent,
        ContractBasicInfoComponent,
        // LocationServicesComponent,
    ],
    imports: [
        SharedModule,
        ContractRoutingModule,
        CustomerModule,
        UserModule,
        LocationServiceModule,
    ],
})
export class ContractModule {
    static forRoot(): any {
        return {
            ngModule: ContractModule,
            providers: [ContractService, ContractStatusService],
        };
    }
}
