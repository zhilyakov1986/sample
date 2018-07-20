import { NgModule } from '@angular/core';
import { SharedModule } from '../common/shared.module';
import { LocationServiceDetailComponent } from './location-service-detail/location-service-detail.component';
import { LocationServicesComponent } from './location-service-list/location-services.component';
import { LocationServiceService } from './locationservice.service';
import { ManageModule } from '../manage/manage.module';
import { GoodModule } from '../goods/good.module';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [
        LocationServicesComponent,
        LocationServiceDetailComponent,
    ],
    exports: [LocationServicesComponent, LocationServiceDetailComponent],
    imports: [SharedModule, ReactiveFormsModule, ManageModule, GoodModule],
})
export class LocationServiceModule {
    static forRoot(): any {
        return {
            ngModule: LocationServiceModule,
            providers: [LocationServiceService],
        };
    }
}
