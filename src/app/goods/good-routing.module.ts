import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, IRoleGuarded, ClaimValues } from '@mt-ng2/auth-module';
import { GoodDetailComponent } from './good-detail/good-detail.component';
import { GoodsComponent } from './good-list/goods.component';
import { GoodService } from './good.service';
import { GoodHeaderComponent } from './good-header/good-header.component';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { CommonDocumentsListComponent } from '@mt-ng2/entity-components-documents';

import { ClaimTypes } from '../model/ClaimTypes';

const goodEntityConfig: IEntityRouteConfig = {
    claimType: ClaimTypes.Services,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    documentsPath: 'documents',
    entityIdParam: 'goodId',
    service: GoodService,
};
const goodRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Services,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
};

const goodAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Services,
    claimValues: [ClaimValues.FullAccess],
};

const goodRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: GoodsComponent,
        data: goodRoleGuard,
        path: 'goods',
    },
    // settings
    {
        canActivate: [AuthGuard],
        children: [
            { path: '', component: GoodDetailComponent, pathMatch: 'full' },
        ],
        component: GoodHeaderComponent,
        data: goodAddRoleGuard,
        path: 'goods/add',
    },
    {
        canActivate: [AuthGuard],
        children: [
            { path: '', component: GoodDetailComponent, pathMatch: 'full' },
            {
                component: CommonDocumentsListComponent,
                path: goodEntityConfig.documentsPath,
                pathMatch: 'full',
            },

        ],
        component: GoodHeaderComponent,
        data: goodEntityConfig,
        path: `goods/:${goodEntityConfig.entityIdParam}`,
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(goodRoutes)],
})
export class GoodRoutingModule {}
