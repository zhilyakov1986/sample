import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, IRoleGuarded, ClaimValues } from '@mt-ng2/auth-module';
import { CustomersComponent } from './customers/customer-list/customers.component';
import { LoginComponent, ForgotPasswordComponent, ResetPasswordComponent } from '@mt-ng2/login-module';
import { AppSettingsComponent } from './app-settings..component';
import { ClaimTypes } from './model/ClaimTypes';
import { UserService } from './users/user.service';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { CommonAddressesListComponent } from '@mt-ng2/entity-components-addresses';
import { CommonDocumentsListComponent } from '@mt-ng2/entity-components-documents';
import { UserHeaderComponent } from './users/user-header/user-header.component';

const homeRoleGuard: IRoleGuarded = {
  claimType: ClaimTypes.Customers,
  claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
  isHomePage: true,
};

const userEntityConfig: IEntityRouteConfig = {
  addressesPath: 'addresses',
  claimType: ClaimTypes.Users,
  documentsPath: 'documents',
  entityIdParam: 'userId',
  notesPath: 'notes',
  service: UserService,
};

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'forgotpassword', component: ForgotPasswordComponent },
    { path: 'resetpassword', component: ResetPasswordComponent },
    { path: 'home', component: CustomersComponent, canActivate: [AuthGuard], data: homeRoleGuard },
    { path: 'settings', component: AppSettingsComponent, canActivate: [AuthGuard] },
    {
      canActivate: [AuthGuard],
      component: UserDetailComponent,
      data: userEntityConfig,
      path: 'my-profile',
      pathMatch: 'full',
    },
    { path: '**', component: CustomersComponent, canActivate: [AuthGuard], data: homeRoleGuard },
  ];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(
      appRoutes,
    ),
  ],
})
export class AppRoutingModule {

}
