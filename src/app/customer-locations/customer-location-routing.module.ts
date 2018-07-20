import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, IRoleGuarded, ClaimValues } from '@mt-ng2/auth-module';

import { CustomerLocationsComponent } from './customer-location-list/customer-locations.component';
import { CommonAddressesListComponent } from '@mt-ng2/entity-components-addresses';
import { CustomerLocationDetailComponent } from './customer-location-detail/customer-location-detail.component';
import { CustomerLocationService } from './customerlocation.service';
import { CustomerLocationHeaderComponent } from './customer-location-header/customer-location-header.component';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { CommonDocumentsListComponent } from '@mt-ng2/entity-components-documents';
import {
    SubEntitiesInfoComponent,
    SubEntitiesListComponent,
} from '@mt-ng2/sub-entities-module';

import { ClaimTypes } from '../model/ClaimTypes';

const customerLocationEntityConfig: IEntityRouteConfig = {
    addressesPath: 'addresses',
    claimType: ClaimTypes.Customers,
    // claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    documentsPath: 'documents',
    entityIdParam: 'customerLocationId',
    service: CustomerLocationService,
};
const customerLocationRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Customers,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
};

const customerLocationAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Customers,
    claimValues: [ClaimValues.FullAccess],
};

const customerLocationRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: CustomerLocationsComponent,
        data: customerLocationRoleGuard,
        path: 'customerlocations',

    },
    {
        canActivate: [AuthGuard],
        children: [
            {
                component: CustomerLocationDetailComponent,
                path: '',
                pathMatch: 'full',
            },
        ],
        component: CustomerLocationHeaderComponent,
        data: customerLocationAddRoleGuard,
        path: 'customerlocations/add',
    },

    {
        canActivate: [AuthGuard],

        children: [
            {
                component: CustomerLocationDetailComponent,
                path: '',
                pathMatch: 'full',
            },
            {
                component: CommonDocumentsListComponent,
                path: customerLocationEntityConfig.documentsPath,
                pathMatch: 'full',
            },
            {
                component: CommonAddressesListComponent,
                path: customerLocationEntityConfig.addressesPath,
                pathMatch: 'full',
            },
        ],

        component: CustomerLocationHeaderComponent,
        data: customerLocationEntityConfig,
        path: `customerlocations/:${
            customerLocationEntityConfig.entityIdParam
        }`,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(customerLocationRoutes)],
})
export class CustomerLocationRoutingModule {}
