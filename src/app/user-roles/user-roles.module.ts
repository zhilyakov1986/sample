import { NgModule } from '@angular/core';

import { SharedModule } from '../common/shared.module';

import { UserRoleService } from './user-role.service';
import { UserRoleRoutingModule } from './user-role-routing.module';
import { UserRolesComponent } from './user-role-list/user-roles.component';
import { UserRoleDetailComponent } from './user-role-detail/user-role-detail.component';
import { UserRoleHeaderComponent } from './user-role-header/user-role-header.component';
import { UserRoleBasicInfoComponent } from './user-role-basic-info/user-role-basic-info.component';
import { UserRolePermissionComponent } from './user-role-permission/user-role-permission.component';

@NgModule({
    declarations: [
        UserRolesComponent,
        UserRoleDetailComponent,
        UserRoleHeaderComponent,
        UserRoleBasicInfoComponent,
        UserRolePermissionComponent,
    ],
    imports: [SharedModule, UserRoleRoutingModule],
})
export class UserRoleModule {
    static forRoot(): any {
        return {
            ngModule: UserRoleModule,
            providers: [UserRoleService],
        };
    }
}
