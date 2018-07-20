import { NgModule } from '@angular/core';
import { StateComponent } from './states/state.component';

import { SharedModule } from '../common/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { StatesService } from './states.service';
import { CommonService } from '../common/services/common.service';
import { ListsComponent } from './lists/lists.component';
import { ServiceAreaService } from './service-area.service';
import { UnitTypeService } from './unit-type.service';
import { ServiceDivisionService } from './service-division.service';

@NgModule({
    declarations: [StateComponent, ListsComponent],
    imports: [SharedModule, ManageRoutingModule],
})
export class ManageModule {
    static forRoot(): any {
        return {
            ngModule: ManageModule,
            providers: [
                StatesService,
                CommonService,
                ServiceAreaService,
                UnitTypeService,
                ServiceDivisionService,
            ],
        };
    }
}
