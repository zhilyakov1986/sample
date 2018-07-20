import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, IRoleGuarded, ClaimValues } from '@mt-ng2/auth-module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomersComponent } from './customer-list/customers.component';
import { CommonNotesListComponent } from '@mt-ng2/entity-components-notes';
import { CustomerService } from './customer.service';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { CommonAddressesListComponent } from '@mt-ng2/entity-components-addresses';
import { CommonDocumentsListComponent } from '@mt-ng2/entity-components-documents';
import { CustomerSettingsComponent } from './customer-settings/customer-settings.component';

import { ClaimTypes } from '../model/ClaimTypes';
import {
    CommonContactsListComponent,
    CommonContactsAdditionalInfoComponent,
} from '@mt-ng2/entity-components-contacts';
import { CustomerContactService } from './customercontact.service';

const customerEntityConfig: IEntityRouteConfig = {
    addressesPath: 'addresses',
    claimType: ClaimTypes.Customers,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    contactsPath: 'contacts',
    documentsPath: 'documents',
    entityIdParam: 'customerId',
    notesPath: 'notes',
    service: CustomerService,
};

const customerContactEntityConfig: IEntityRouteConfig = {
    claimType: ClaimTypes.Customers,
    entityIdParam: 'contactId',
    service: CustomerContactService,
};

const customerRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Customers,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
};

const customerAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Customers,
    claimValues: [ClaimValues.FullAccess],
};

// TODO LAS: Bad Routes give a generic error notification.  It's really unhelpful, so we should investigate why that happens

const customerRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: CustomersComponent,
        data: customerRoleGuard,
        path: 'customers',
    },
    {
        canActivate: [AuthGuard],
        component: CustomerSettingsComponent,
        path: 'customers/settings',
        pathMatch: 'full',
    },
    {
        canActivate: [AuthGuard],
        children: [
            { path: '', component: CustomerDetailComponent, pathMatch: 'full' },
        ],
        component: CustomerHeaderComponent,
        data: customerAddRoleGuard,
        path: 'customers/add',
    },
    {
        canActivate: [AuthGuard],
        children: [
            { path: '', component: CustomerDetailComponent, pathMatch: 'full' },
            {
                component: CommonNotesListComponent,
                path: customerEntityConfig.notesPath,
                pathMatch: 'full',
            },
            {
                component: CommonAddressesListComponent,
                path: customerEntityConfig.addressesPath,
                pathMatch: 'full',
            },
            {
                component: CommonDocumentsListComponent,
                path: customerEntityConfig.documentsPath,
                pathMatch: 'full',
            },
            {
                component: CommonContactsListComponent,
                path: customerEntityConfig.contactsPath,
                pathMatch: 'full',
            },
            {
                component: CommonContactsAdditionalInfoComponent,
                data: customerContactEntityConfig,
                path: `${customerEntityConfig.contactsPath}/:${
                    customerContactEntityConfig.entityIdParam
                }`,
                pathMatch: 'full',
            },
        ],
        component: CustomerHeaderComponent,
        data: customerEntityConfig,
        path: `customers/:${customerEntityConfig.entityIdParam}`,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(customerRoutes)],
})
export class CustomerRoutingModule {}
