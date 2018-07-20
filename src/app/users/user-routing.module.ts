import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './user-list/users.component';
import { UserService } from './user.service';
import { UserHeaderComponent } from './user-header/user-header.component';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { CommonAddressesListComponent } from '@mt-ng2/entity-components-addresses';
import { CommonDocumentsListComponent } from '@mt-ng2/entity-components-documents';

import { ClaimTypes } from '../model/ClaimTypes';

const userEntityConfig: IEntityRouteConfig = {
  addressesPath: 'addresses',
  claimType: ClaimTypes.Users,
  claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
  documentsPath: 'documents',
  entityIdParam: 'userId',
  notesPath: '',
  service: UserService,
};

const userRoleGuard: IRoleGuarded = {
  claimType: ClaimTypes.Users,
  claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
};

const userAddRoleGuard: IRoleGuarded = {
  claimType: ClaimTypes.Users,
  claimValues: [ClaimValues.FullAccess],
};

const userRoutes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: userRoleGuard },
  {
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UserDetailComponent, pathMatch: 'full' },
    ],
    component: UserHeaderComponent,
    data: userAddRoleGuard,
    path: 'users/add',
  },
  {
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UserDetailComponent, pathMatch: 'full' },
      { path: userEntityConfig.addressesPath, component: CommonAddressesListComponent, pathMatch: 'full' },
      { path: userEntityConfig.documentsPath, component: CommonDocumentsListComponent, pathMatch: 'full' },
    ],
    component: UserHeaderComponent,
    data: userEntityConfig,
    path: `users/:${userEntityConfig.entityIdParam}`,
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(
      userRoutes,
    ),
  ],
})
export class UserRoutingModule {

}
