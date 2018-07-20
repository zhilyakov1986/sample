import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '@mt-ng2/auth-module';
import { StateComponent } from './states/state.component';
import {
    SubEntitiesInfoComponent,
    SubEntitiesListComponent,
} from '@mt-ng2/sub-entities-module';
import { ListsComponent } from './lists/lists.component';

const manageRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: StateComponent,
        path: 'states',
        pathMatch: 'full',
    },
    {
        canActivate: [AuthGuard],
        component: ListsComponent,
        path: 'lists',
        pathMatch: 'full',
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(manageRoutes)],
})
export class ManageRoutingModule {}
