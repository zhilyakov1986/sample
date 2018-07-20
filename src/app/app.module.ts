import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieModule } from 'ngx-cookie';
import { NgxMaskModule } from 'ngx-mask';

import { AuthModule } from '@mt-ng2/auth-module';
import { CommonFunctionsService } from '@mt-ng2/common-functions';
import { EnvironmentModule } from '@mt-ng2/environment-module';
import { FormatFunctionsService } from '@mt-ng2/format-functions';
import { NotificationsModule } from '@mt-ng2/notifications-module';
import { GlobalErrorHandler, ErrorsModule } from '@mt-ng2/errors-module';

import { AppRoutingModule } from './app-routing.module';
import { AppNavModule } from './app-nav.module';
import { SharedModule } from './common/shared.module';
import { AppComponent } from './app.component';
import { environment } from './environments/environment';
import { CustomToastOptions } from './toaster-options';

import { CustomerModule } from './customers/customer.module';
import { CustomerLocationModule } from './customer-locations/customer-location.module';
import { UserModule } from './users/user.module';
import { MtLoginModule } from '@mt-ng2/login-module';
import { UserRoleModule } from './user-roles/user-roles.module';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { AppSettingsComponent } from './app-settings..component';
import { AppSettingsService } from './app-settings.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DndModule } from 'ng2-dnd';
import { ManageModule } from './manage/manage.module';
import { GoodModule } from './goods/good.module';
import { ContractModule } from './contracts/contract.module';
import { LocationServiceModule } from './location-services/location-service.module';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent, AppSettingsComponent],
    imports: [
        BrowserModule,
        NgbModule.forRoot(),
        SharedModule.forRoot(),
        HttpClientModule,
        NgProgressModule.forRoot({
            color: '#ff8b56',
            spinnerPosition: 'left',
            thick: false,
        }),
        NgProgressHttpModule,
        CookieModule.forRoot(),
        EnvironmentModule.forRoot(environment),
        AuthModule.forRoot(),
        ManageModule.forRoot(),
        CustomerLocationModule.forRoot(),
        CustomerModule.forRoot(),
        UserModule.forRoot(),
        UserRoleModule.forRoot(),
        GoodModule.forRoot(),
        ContractModule.forRoot(),
        LocationServiceModule.forRoot(),
        AppRoutingModule,
        NotificationsModule.forRoot(CustomToastOptions),
        NgxMaskModule.forRoot(),
        AppNavModule.forRoot(),
        MtLoginModule.forRoot(),
        ErrorsModule.forRoot(),
    ],
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        CommonFunctionsService,
        FormatFunctionsService,
        AppSettingsService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
    ],
})
export class AppModule {}
