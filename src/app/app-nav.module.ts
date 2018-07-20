import { NgModule } from '@angular/core';

import { ClaimValues } from '@mt-ng2/auth-module';
import { NavModule, IMenuItem } from '@mt-ng2/nav-module';

import { ClaimTypes } from './model/ClaimTypes';

@NgModule({
    exports: [NavModule],
    imports: [NavModule.forRoot()],
})
export class AppNavModule {
    static forRoot(): any {
        return {
            ngModule: AppNavModule,
            providers: [{ provide: 'MtNavMenu', useValue: getMenu() }],
        };
    }
}

export function getMenu(): IMenuItem[] {
    // tslint:disable:object-literal-sort-keys
    // TO DO AZ figure out claim types
    return [
        {
            Title: 'Administration',
            IconClass: 'fa fa-fw fa-university',
            ExpandedByDefault: true,
            RouterLink: '',
            ClaimType: ClaimTypes.AppSettings,
            ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
            SettingsRouterLink: '/settings',
            SettingsClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
            Children: [
                {
                    Title: 'Users',
                    IconClass: 'fa fa-fw fa-user',
                    RouterLink: '/users',
                    ClaimType: ClaimTypes.Users,
                    ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
                    AddRouterLink: '/users/add',
                    AddClaimValues: [ClaimValues.FullAccess],
                },
                {
                    Title: 'User Roles',
                    IconClass: 'fa fa-fw fa-lock',
                    RouterLink: '/roles',
                    ClaimType: ClaimTypes.UserRoles,
                    ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
                    AddRouterLink: 'roles/add',
                    AddClaimValues: [ClaimValues.FullAccess],
                },
                {
                    Title: 'Manage List Items',
                    IconClass: 'fa fa-fw fa-lock',
                    RouterLink: '/lists',
                    ClaimType: ClaimTypes.Services,
                    ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
                },
                {
                    Title: 'Manage States',
                    IconClass: 'fa fa-fw fa-lock',
                    RouterLink: '/states',
                    ClaimType: ClaimTypes.Services,
                    ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
                },
            ],
        },
        {
            Title: 'Customers',
            IconClass: 'fa fa-fw fa-briefcase',
            RouterLink: '',
            ClaimType: ClaimTypes.Customers,
            ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
            Children: [
                {
                    Title: 'Manage Customers',
                    IconClass: 'fa fa-fw fa-briefcase',
                    RouterLink: '/customers',
                    ClaimType: ClaimTypes.Customers,
                    ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
                    SettingsRouterLink: '/customers/settings',
                    SettingsClaimValues: [
                        ClaimValues.ReadOnly,
                        ClaimValues.FullAccess,
                    ],
                    AddRouterLink: '/customers/add',
                    AddClaimValues: [ClaimValues.FullAccess],
                },
                {
                    Title: `Customer Locations`,
                    IconClass: 'fa fa-fw fa-briefcase',
                    RouterLink: '/customerlocations',
                    ClaimType: ClaimTypes.Customers,
                    ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
                    AddRouterLink: '/customerlocations/add',
                    AddClaimValues: [ClaimValues.FullAccess],
                },
            ],
        },
        {
            Title: 'Customer Contracts',
            IconClass: 'fa fa-fw fa-briefcase',
            RouterLink: '/contracts',
            ClaimType: ClaimTypes.Customers,
            ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
            AddRouterLink: '/contracts/add',
            AddClaimValues: [ClaimValues.FullAccess],
        },
        {
            Title: 'Services',
            IconClass: 'fa fa-fw fa-briefcase',
            RouterLink: '/goods',
            ClaimType: ClaimTypes.Services,
            ClaimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
            AddRouterLink: '/goods/add',
            AddClaimValues: [ClaimValues.FullAccess],
        },
    ];
    // tslint:enable:object-literal-sort-keys
}
