import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { ClaimTypes } from '../model/ClaimTypes';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserRoleService } from './user-role.service';
import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';
import { UserRolesComponent } from './user-role-list/user-roles.component';
import { UserRoleDetailComponent } from './user-role-detail/user-role-detail.component';
import { UserRoleHeaderComponent } from './user-role-header/user-role-header.component';

const userRoleEntityConfig: IEntityRouteConfig = {
    addressesPath: '',
    claimType: ClaimTypes.UserRoles,
    documentsPath: '',
    entityIdParam: 'userRoleId',
    notesPath: '',
    service: UserRoleService,
};

const userRoleRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.UserRoles,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
};

const userRoleAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.UserRoles,
    claimValues: [ClaimValues.FullAccess],
};

const userRoleRoutes: Routes = [
    { path: 'roles', component: UserRolesComponent, canActivate: [AuthGuard], data: userRoleRoleGuard },
    {
        canActivate: [AuthGuard],
        children: [
            { path: '', component: UserRoleDetailComponent, pathMatch: 'full' },
        ],
        component: UserRoleHeaderComponent,
        data: userRoleAddRoleGuard,
        path: 'roles/add',
    },
    {
        canActivate: [AuthGuard],
        children: [
            { path: '', component: UserRoleDetailComponent, pathMatch: 'full' },
        ],
        component: UserRoleHeaderComponent,
        data: userRoleEntityConfig,
        path: `roles/:${userRoleEntityConfig.entityIdParam}`,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(
            userRoleRoutes,
        ),
    ],
})
export class UserRoleRoutingModule {

}
