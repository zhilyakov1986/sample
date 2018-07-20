import { NgModule } from '@angular/core';
import { AuthUserPortalAccessComponent } from './auth-user/auth-user-portal-access/auth-user-portal-access.component';
import { SharedModule } from '../common/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { DynamicFormModule } from '@mt-ng2/dynamic-form';
import { AuthUserPasswordComponent } from './auth-user/auth-user-password/auth-user-password.component';
import { MtPreventDoubleClickButtonModule } from '@mt-ng2/disable-double-click';

@NgModule({
  bootstrap: [],
  declarations: [
    AuthUserPortalAccessComponent,
    AuthUserPasswordComponent,
  ],
  exports: [
    AuthUserPortalAccessComponent,
    AuthUserPasswordComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    DynamicFormModule,
    MtPreventDoubleClickButtonModule,
  ],
})
export class AuthEntityModule { }
