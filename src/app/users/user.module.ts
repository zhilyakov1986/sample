import { NgModule } from '@angular/core';

import { SharedModule } from '../common/shared.module';
import { UserRoutingModule } from './user-routing.module';

import { UserBasicInfoComponent } from './user-basic-info/user-basic-info.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UsersComponent } from './user-list/users.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { UserPhotoComponent } from './user-photo/user-photo.component';

import { UserService } from './user.service';
import { ManageModule } from '../manage/manage.module';

@NgModule({
    declarations: [
        UsersComponent,
        UserHeaderComponent,
        UserDetailComponent,
        UserBasicInfoComponent,
        UserPhotoComponent,
    ],
    exports: [UsersComponent],
    imports: [SharedModule, UserRoutingModule, ManageModule],
})
export class UserModule {
    static forRoot(): any {
        return {
            ngModule: UserModule,
            providers: [UserService],
        };
    }
}
